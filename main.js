/* let deferredPrompt;
const addBtn = document.querySelector('#fab');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
}); */
const fab = document.querySelector('#fab');
let deferredPrompt;



window.addEventListener('beforeinstallprompt', (event) => {
   alert('gggggggggggggggggggggggggggggggggggggggggggggg');
    console.log('beforeinstallprompt run .');
    event.preventDefault();
    deferredPrompt=event;
    
 fab.addEventListener('click', (event) => {
     
        if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function (choice) {
          console.log(choice);
          if (choice.outcome === 'dismissed') {
            console.log('installation was cancelled');
          } else {
            console.log('User Added To Home Screen');
          }
        });
        deferredPrompt = null;
      }
      
      
    
    
    });  
  
  }); 


console.log('hhhhhh');



    
    window.addEventListener('load',function(){
      alert('c');
        navigator.serviceWorker.register('/sw.js',{scope:'/'}).
        then(function(res){
          alert('d');
            console.log('Service worker registered! and scope is:'+res.scope);
            console.log(res);

        }).
        catch(function(err){
            console.error('SW Errors while registering!', err);

        })
    })

var app = (function () {
  var indexPage = function () {
    // Register Dialog box
    /* var dialog = document.querySelector('dialog');
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').addEventListener('click', function () {
      window.history.back(1);
      dialog.close();
    });
 */
    // Placehodlers
    var TITLE_PLACEHOLDER = '{{TITLE}}';
    var NOTE_PLACEHOLDER = '{{NOTE}}';
    var ID_PLACEHOLDER = '{{ID}}';
    var SYNCED_PLACEHOLDER = '{{SYNCED}}';
    //var DATE_PLACEHOLDER = '{{DATE}}';
    var CLOUD_ICON =
      '<div id="tt3" class="icon material-icons">cloud_upload</div>';
    var EMPTY_NOTE_PLACEHODER = '<div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet" id="column"> <div class="mdl-card mdl-shadow--2dp" style="width:95%; margin:1rem; text-align:center; padding:1rem"> <h3>You dont have any notes!</h3> </div> </div>';
    // TO See how this template looks like, please open index.html and see comment under <div id="grid"></div>
    var NOTE_TEMPLATE =
      '<!-- Column START --> <div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet"> <!-- CARD START --> <div id="{{ID}}" class="mdl-card mdl-shadow--2dp" style="width:95%; margin:1rem"> <div class="mdl-card__title"> <h2 class="mdl-card__title-text">{{TITLE}}  {{SYNCED}}</h2> </div> <div class="mdl-card__media mdl-color--cyan" style="padding:2px"> </div> <div class="mdl-card__supporting-text"> {{NOTE}} </div> <div class="mdl-card__actions mdl-card--border"> <a href="/add.html?id={{ID}}" class="mdl-button mdl-js-button mdl-button--colored mdl-color-text--cyan mdl-js-ripple-effect">  </a> <a href="#id={{ID}}" class="delete-button mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">  </a> <div class="mdl-layout-spacer"></div><div class="mdl-layout-spacer"></div> <p class="mdl-textfield--align-right"></p> </div> </div> <!-- CARD END --> </div> <!-- Column END -->';

    var getRegex = function (str) {
      return new RegExp(str, 'g');
    };

    var replacePlaceholders = function (data) {
      var title = data.title;
      var note = data.note;
      var id = data.id;
      //var date = data.date;
      var synced = data.synced ? '' : CLOUD_ICON;
      
      var HTML = NOTE_TEMPLATE.replace(getRegex(TITLE_PLACEHOLDER), title);
      HTML = HTML.replace(getRegex(ID_PLACEHOLDER), id);
      HTML = HTML.replace(getRegex(NOTE_PLACEHOLDER), note);
      /* const d = new Date(date)
      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)   */
      //HTML = HTML.replace(getRegex(DATE_PLACEHOLDER), date);
      //HTML = HTML.replace(getRegex(DATE_PLACEHOLDER), `${da}-${mo}-${ye}`);
      HTML = HTML.replace(getRegex(SYNCED_PLACEHOLDER), synced);
      //HTML = HTML.replace(getRegex(NOTE_PLACEHOLDER), note);

      return HTML;
    };

    var getListOfDeleteButtons = function () {
      // get all delete-button classes
      return document.querySelectorAll('.delete-button');
    };

    var removeClickListerner = function () {
      var buttonsElements = getListOfDeleteButtons();
      for (var i = 0; i < buttonsElements.length; i++) {
        buttonsElements[i].removeEventListener('click', showModalFn, false);
      }
    };

    var attachClickTodeleteButtons = function () {
      var buttonsElements = getListOfDeleteButtons();
      // Attach click event to all delete-button
      for (var i = 0; i < buttonsElements.length; i++) {
        buttonsElements[i].addEventListener('click', showModalFn);
      }
    };

    // Show notes
    var updateUI = function (data) {
      removeClickListerner();
      var grid = document.querySelector('#grid');
      grid.innerHTML = '';
      if (!data.length) {
        grid.insertAdjacentHTML('beforeend', EMPTY_NOTE_PLACEHODER);
        return;
      }
      for (var i = 0; i < data.length; i++) {
     
        var snippet = replacePlaceholders({
          
          title: data[i].Title,
          note: data[i].SmallText,
          id: data[i].Autorec,
          //date: data[i].dates,
          synced: true
          
        });
     
        grid.insertAdjacentHTML('beforeend', snippet);
      }
      attachClickTodeleteButtons();
    };

    var showModalFn = function () {
      dialog.showModal();
    };
    
    var sortedByDate = function (data) {
      var getTime = function (d) {
        return new Date(d).getTime();
      };
      return data.sort(function (a, b) {
        return getTime(b.date) - getTime(a.date);
      });
    };

    var sortAndUpdate=function(data){

             var sorted =sortedByDate(data);
             updateUI(sorted);



    };

    var SERVER_URL='http://iranicdl.ir/webapi/api/values';
    var getDataAndUpdateUI = function () {

     var dataArray=[];

     GETALLContent()
      .then(function (data) {   
       
         console.log(data);
        for(var key in data)
        {
            data[key].id=key;
            dataArray.push(data[key]);
           // db.writeNote(data[key]);

        }
      
        sortAndUpdate(data);
        

      }).catch(function(err){
alert('!');
console.log(err);
        db.readAllNote()
        .then(function (data) {
          sortAndUpdate(data);
          })
         
        });

    };
       

     
     

  

    var deleteNote = function (id) {
      db.deleteNote(id)
        .then(function () {
          getDataAndUpdateUI();
          helpers.showMessage('Note deleted: ' + id);
          window.history.back(1);
        });


    };

    // Call initially to update data
    getDataAndUpdateUI();

   /*  dialog
      .querySelector('.confirmDelete')
      .addEventListener('click', function () {
        var id = helpers.getHashByName('id');
        deleteNote(parseInt(id, 10));
        dialog.close();
      }); */
  };

  var addPage = function () {
    var id = helpers.getParameterByName('id'); // "1"
    var pageTitle = document.querySelector('#page-title');
    var addNoteForm = document.forms.addNote; // Or document.forms['addNote']
    var titleInput = addNoteForm.elements.title;
    var noteInput = addNoteForm.elements.note;

    var AttachSubmitForm = function (data) {
      // Listen to form submit
      addNoteForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var title = titleInput.value.trim();
        var note = noteInput.value.trim();

        if (title === '' || note === '') {
          helpers.showMessage('Please enter valid data!');
          return;
        }

        var noteData = {
          id: data ? data.id : new Date().getTime(),
          Title: title,
          SmallText: note,
          //DateCreate: new Date(),
          synced: false,
        };

        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready
            .then(function (sw) {
              db.writeNote(noteData)
                .then(function () {
                  helpers.showMessage('successfully updated to local db!');
                  setTimeout(function () {
                    window.location.href='/index.html';
                  }, 500);
                  return sw.sync.register(BACKGROUND_SYNC_SAVE);
                });
            });
        }
        else{
          sendData(noteData)
          .then(function () {
            helpers.showMessage('successfully saved to server db!');
            setTimeout(function () {
              window.location.href='/index.html';
            }, 500);
          });
        }


      });
    };

    // This means we are in edit mode
    if (id) {
      pageTitle.innerHTML = 'Edit your Note';
      // get Note information from DB
      db.getNote(parseInt(id, 10))
        .then(function (data) {
          titleInput.value = data.title;
          noteInput.value = data.note;
          AttachSubmitForm(data);
        });
    } else {
      // call essential methods
      AttachSubmitForm();
    }
  };

  return {
    indexPage: indexPage,
    addPage: addPage,
  };
})();


/*  var notificationButton=document.querySelector('.notification-button');
var modifyNotificationButton=function(){
  notificationButton.innerHTML='Subscribed';
  notificationButton.disabled=true;

}; */

/* function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
} */


/* function storePushSub(){
  var swreq;
  navigator.serviceWorker.ready.
  then(function(req){
    swreq=req;
    return req.pushManager.getSubscription();

  }).then(function(pushsubscription){
    if(pushsubscription)
    {
      return;
    }
    else
    {
      publicVapidKey='BF5KxpU5ZBv5VnHoC9zt3OSaXXubme1ZHKxnF1tNXHTL8_Td7HqETv28afd7jkj9rtXsMtBJgnKw4coMzHzijuI';
      privateVapidKey='HIVPRmkPGw3v1q3YazM6JS_7NJqid7XFMDyBPVorBRw';
        swreq.pushManager.subscribe({
          convertedVapidKey=urlBase64ToUint8Array(publicVapidKey),
          userVisibleOnly:true,
          applicationServerKey:convertedVapidKey
        }).then(function(newpushsubscription){
          return postsubscription(newpushsubscription);

        })
    }

  })
} */


/* function requestPermission(){
  Notification.requestPermission(function(userChoice){
    if(userChoice==='denied')
    {
       console.log('Notification Permission Denied !');
    }
    else
    {
      console.log('Notification Accept !');
      //storePushSub();
      showSuccessMessage();
    }

  })

}
var showSuccessMessage=function(){
  var options = {
    body: 'You have successfully subscribed to our Notification service!',
    icon: '/assets/images/icons/icon-96x96.png',
    image: '/assets/images/icons/icon-96x96.png',
    badge: '/assets/images/icons/icon-96x96.png',
    dir: 'ltr', // 'auto' | 'ltr' | 'rtl'
    vibrate: [100, 50, 200],
  };
  new Notification('Subscription granted!',options)
}
if('Notification' in window && 'serviceWorker' in navigator)
{
   if(Notification.permission==='granted')
   {
     modifyNotificationButton();
   }
   else
   {
     notificationButton.addEventListener('click',requestPermission);
   }
}
else
{

} */
