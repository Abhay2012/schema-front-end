import { Injectable } from '@angular/core';

@Injectable()
export class StaticContentService{
    navBar : any[] = [
        {
            title : 'Users List', 
            tab : 1
        },
        {
            title : 'Adress', 
            tab : 2
        },
        {
            title : 'Verktyg', 
            tab : 3
        },
        {
            title : 'SpårOchBlock', 
            tab : 4
        },
        {
            title : 'Template', 
            tab : 5
        },
        {
            title : 'Deltagares Namn', 
            tab : 6
        },
        {
            title : 'Events Template', 
            tab : 7
        }
    ];

    create : any[] = [
        {
            title : 'user',
            id : '#createUser',
            tab : 1
        },
        {
            title : 'adress',
            id : '#createAddress',
            tab : 2
        },
        {
            title : 'Verktyg',
            id : '#createVer',
            tab : 3
        },
        {
            title : 'SpårOchBlock',
            id : '#createSpa',
            tab : 4
        },
        {
            title : 'Template',
            id : '#createTemp',
            tab : 5
        }
    ];

    spaBlockTemplates = [
        { 
            name: '', 
            color: '', 
            hrs: '' 
        }, 
        { 
            name: '', 
            color: '',
            hrs: ''
        }, 
        {
            name: '',
            color: '',
            hrs: '' 
        }
    ];

    newDelName = { 
        name: '', 
        spa: '', 
        start: new Date(), 
        end: new Date() 
    };

    selectedWeek = {
        week : 0,
        delName : '',
        user : '',
        spaBlock : '',
        timmar : 0,
        events : []
    };

    lock : boolean = true;
}