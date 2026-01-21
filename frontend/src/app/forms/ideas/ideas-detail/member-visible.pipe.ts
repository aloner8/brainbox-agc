import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'memberVisible',
    pure: false
})
export class MemberVisiblePipe implements PipeTransform {
    transform(items: any[]): any {
        if (!items ) {
            return items;
        }
    //console.log(items)
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.object.remove==false);
    }
}