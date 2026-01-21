const { query } = require('./db.service');
const { sendMail } = require('./mail.service');

/**
 * Send project state mail by state id
 */
async function sendMailByIdState(idState) {
  // 1️⃣ ดึงข้อมูล mail จาก DB
  const rows = await query(
    'SELECT get_project_states_mail($1) AS data',
    [idState]
  );

  const mailData = rows[0]?.data?.[0];
  if (!mailData) {
    throw new Error('mail data not found');
  }

  const mailOptions = {
    to: mailData.send_to_text,
    cc: mailData.send_cc_text,
    subject: mailData.detail,
    text: mailData.detail,
    html: mailData.body
  };

  try {
    // 2️⃣ ส่งเมล์
    const info = await sendMail(mailOptions);

    // 3️⃣ update state success
    await query(
      `UPDATE project_states_mail
       SET repeat_time = repeat_time + 1,
           send_at = now(),
           send_next = NULL,
           status = 1
       WHERE id = $1`,
      [mailData.id]
    );

    // 4️⃣ log success
    await query(
      `INSERT INTO event_log (topic, user_id, detail_text, detail_json)
       VALUES ('Send Mail State', 0, $1, $2::json)`,
      [mailOptions.subject, { status: 'success', info }]
    );

    return { status: 'success' };

  } catch (err) {
    // 5️⃣ update retry state
    await query(
      `UPDATE project_states_mail
       SET repeat_time = repeat_time + 1,
           send_at = now(),
           send_next = now() + interval '1 day',
           status = 2
       WHERE id = $1`,
      [mailData.id]
    );

    // 6️⃣ log error
    await query(
      `INSERT INTO event_log (topic, user_id, detail_text, detail_json)
       VALUES ('Send Mail State Error', 0, $1, $2::json)`,
      [mailOptions.subject, { status: 'error', error: err.message }]
    );

    throw err;
  }
}

module.exports = {
  sendMailByIdState
};
