var SERVER_URL='http://iranicdl.ir/webapi/api/values/';
var SERVER_URL_Subscribe='http://iranicdl.ir/webapi/api/subscribe/';
//var SERVER_URL='https://reqres.in/api/users/2';
var BACKGROUND_SYNC_SAVE='new-notes-sync';
function GETALLContent()
{
    console.log('777777777777777777777');
    return fetch(SERVER_URL).then((res)=>{
        console.log('2222222222222222222222222222222222222222222222');
        return res.json();
    }).catch((err)=>{
        console.log('1');
console.log('error',err);
    });
   // ,{ mode: 'no-cors' }
}

function GETALLContentbyid(id)
{
     return fetch(SERVER_URL+id);
}

function sendData(ContentData)
{
       return fetch(SERVER_URL,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
            body:JSON.stringify(ContentData)
        });
}

function updateData(ContentData)
{
    return fetch(SERVER_URL+ContentData.id,{

        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
        body:JSON.stringify(ContentData)
    });
}

function deleteData(id)
{
    return fetch(SERVER_URL+id,{
        method:'Delete',
        headers:{
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
        body:JSON.stringify({id:id})
    });
}


function postsubscription(sub){
    return fetch(SERVER_URL_Subscribe,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
            body:JSON.stringify(sub)
        });

}