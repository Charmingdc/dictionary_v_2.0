$(document).ready(function() {
 
  const toggle = document.querySelector('#toggle');
  const bdy = document.querySelector('.bdy');
  
  // function to apply theme
  function applyTheme(theme) {
    bdy.classList.remove('bdy', 'dark');
    bdy.classList.add(theme);
  }
  
  // retrieving saved from local storage
  const savedTheme = localStorage.getItem('theme') || 'bdy';
    applyTheme(savedTheme);

  
  // event listener to toggle theme
  toggle.addEventListener('click', () => {
      const currentTheme = bdy.classList.contains('bdy') ? 'bdy' : 'dark';
      const newTheme = currentTheme === 'bdy' ? 'dark' : 'bdy';

      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  
  
  // call to default fetch request for API 
  fetchQueryDefault();
  
  // function to stop fetch request if search input is empty
  $('#enter').click(function() {
     const sh = document.querySelector('.search');
     
     if (sh.value == '') {
       
       sh.style.borderColor = 'red'
       sh.value = "Search can't be empty";
       setTimeout( () => {
         sh.style.borderColor = '';
         sh.value = '';
       }, 2000);
       
     } else {
       fetchQuery();
     }
  });
  
});


// function to fetch default api request 
function fetchQueryDefault() {
  $.ajax({
    type: 'GET',
    url: 'https://api.dictionaryapi.dev/api/v2/entries/en/code',
    dataType: 'json',
    contentType: 'application/json',
    success: function(response) {
      processData(response);
    },
    error: function(jqXHR) {
      console.log('error: ' + jqXHR.responseText);
    }
  });
}


// function to fetch main api request 
function fetchQuery() {
  var query = $('#search').val();
  
  $.ajax({
    type: 'GET',
    url: 'https://api.dictionaryapi.dev/api/v2/entries/en/' + query,
    dataType: 'json',
    contentType: 'application/json',
    success: function(response) {
      $('.entries').html('');
      processData(response);
    },
    error: function(jqXHR) {
      console.log('error: ' + jqXHR.responseText);
      $('.entries').html('');
       processError(jqXHR);
    }
  });
}

const entries = document.querySelector('.entries');
const definitionUL = document.querySelector('definitions');
const word = document.querySelector('#word');
const phonetic = document.querySelector('#phonetic');
const speak = document.querySelector('#speak');
const voice = document.querySelector('#voice');
const source = document.createElement('p');


// function to process api data
function processData(infos) {
  // displaying search keyword source links
  
  source.innerHTML= "source: " + "<a href='" + infos[0].sourceUrls[0] + "'>" + infos[0].sourceUrls[0] + "</a>";
  source.classList.add('source');
  entries.append(source);
   
   // looping through api request data i.e infos
   
   infos.forEach(info => {
     word.textContent = info.word;
     phonetic.textContent = info.phonetic;
   
     // looping through meanings in loop of api request data
     info.meanings.forEach(meaning => {
       const partOfSpeech = document.createElement('div');
       partOfSpeech.classList.add('part-of-speech');
       partOfSpeech.textContent = `Part of speech: ${meaning.partOfSpeech}`;
       entries.append(partOfSpeech);
       
       
       //loooping throug meaning of definitions of api request data
       meaning.definitions.forEach(definition => {
           const defP = document.createElement('p');
           defP.textContent = definition.definition;
           defP.classList.add('def-p');
           entries.append(defP);
     
        // if statement to display examples 
           if (definition.example) {
              const definitionE = document.createElement('p');
              definitionE.classList.add('definition-e');
              definitionE.textContent = `Example: ${definition.example}`;
              entries.append(definitionE);
           }
           
          // if statement to display searched word synonyms
           if (definition.synonyms != false) {
              const definitionS = document.createElement('p');
              definitionS.classList.add('definition-s');
              definitionS.textContent = `Synonyms: ${definition.synonyms}`;
              entries.append(definitionS);
           }
           
          // if statement to display searched word antonyms
           if (definition.antonyms != false) {
              const definitionA = document.createElement('p');
              definitionA.classList.add('definition-a');
              definitionA.textContent = `Antonyms: ${definition.antonyms}`;
              entries.append(definitionA);
           }
          
       });
       
     });
     
   
     // event listener to pronounce seaeched words
      speak.addEventListener('click', e => {
       voice.src = info.phonetics[0].audio;
       voice.play();
      });
  
   });
}


// function to handle api errror case
function processError(error) {
  word.textContent = 'Not available 🥴';
  phonetic.textContent = 'Not available';
  speak.addEventListener('click', e => {
       voice.pause()
  });
  
  const errorP = document.createElement('p');
  errorP.textContent = "Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.";
   entries.append(errorP);
}
