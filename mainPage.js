
document.addEventListener('DOMContentLoaded', () => {
    let jsonArray = [];
    const foodInput = document.getElementById('foodInput');
    const suggestions = document.getElementById('suggestions');
    fetch('calories.csv')
      .then(response => response.text())
      .then(data => {
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        jsonArray = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
          }, {});
        });
        console.log('Calories JSON Array:', jsonArray);
      })
      .catch(error => {
        console.error('Error fetching calories.csv:', error);
      });

    foodInput.addEventListener('input', () => {
        const searchTerm = foodInput.value.toLowerCase();
        const filteredItems = jsonArray.filter(item =>
        item.FoodItem.toLowerCase().includes(searchTerm));
        renderDropdownItems(filteredItems);
    });

    function renderDropdownItems(items) {
    suggestions.innerHTML = ''; // Clear existing items
    if (items.length === 0) {
        suggestions.innerHTML = '<div>No results found</div>';
    } else {
        items.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item.FoodItem;
            div.addEventListener('click', () => {
                foodInput.value = item.FoodItem;
                suggestions.classList.remove('show');
            });
            suggestions.appendChild(div);
        });
    }
    suggestions.classList.add('show');
}

    fetch('key.json')
      .then(response => response.json())
      .then(data => {
        if (data.apiKey) {
          API_KEY = data.apiKey;
          console.log('API key loaded from key.json (masked):', `${data.apiKey.slice(0,4)}...${data.apiKey.slice(-4)}`);
        }
      })
      .catch(error => {
        console.error('Error fetching key.json:', error);
      });

  const generateAi = document.getElementById('generateAi');

  
  function callApiWithKey() {
    if (!API_KEY) {
      alert('No API key loaded. Please load a key from a local file or set it manually.');
      return;
    }
    // Example: show how to include the key in headers; this is a demo and won't run without a valid key
    console.log('Making demo API call with masked key:', `${API_KEY.slice(0,4)}...${API_KEY.slice(-4)}`);
    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: 'Explain how AI    in a few words' }
            ]
          }
        ]
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Response:', data);
      })
      .catch(err => {
        console.error('Error:', err);
      });
  }

  generateAi.addEventListener('click', callApiWithKey);
});





"use strict";

document.addEventListener("DOMContentLoaded", function() {
    const userstats_section = document.getElementById("user-stats");
    const welcome_section = document.getElementById("welcome");
    const aboutUs_section = document.getElementById("about-us");
    const userInfo_section = document.getElementById("user-info");
    const next_button = document.getElementById("next");
    const previous_button = document.getElementById("previous");
    let current_screen = 0;
    let API_KEY = "";

    let user_stats = {
        weight: 0,
        height: 0,
        goal: 0
    };

    function showScreen (index) {
        // 0 = welcome
        // 1 = about us
        // 2 = user info
        // 3 = user stats
        welcome_section.classList.add("hidden")
        aboutUs_section.classList.add("hidden");
        userInfo_section.classList.add("hidden");
        userstats_section.classList.add("hidden");

        if (index === 0) {
            welcome_section.classList.remove("hidden");
            previous_button.classList.remove("hidden");
        }
        else if (index === 1) {
            aboutUs_section.classList.remove("hidden");
        }
        else if (index === 2) {
            userInfo_section.classList.remove("hidden");
        }
        else if (index === 3) {
            userstats_section.classList.remove("hidden");
        }

        current_screen = index;
    }

    showScreen(0);

    userstats_section.addEventListener("input", function(e) {
        if (e.target.id === "weight") user_stats.weight = e.target.value;
        else if (e.target.id === "height") user_stats.height = e.target.value;
        else if (e.target.id === "goal") user_stats.goal = e.target.value;
    })

    previous_button.addEventListener("click", function() {
        if (current_screen > 0) {
            showScreen(current_screen-1);
        }
    });

    next_button.addEventListener("click", function() {
        if (current_screen < 3) {
            showScreen(current_screen+1);
        }
    });

    let jsonArray = [];
    fetch('calories.csv')
    .then(response => response.text())
    .then(data => {
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        jsonArray = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
          }, {});
        });
        console.log('Calories JSON Array:', jsonArray);
    })
    .catch(error => {
        console.error('Error fetching calories.csv:', error);
    });

    const foodInput = document.getElementById('foodInput');
    const suggestions = document.getElementById('suggestions'); 
        foodInput.addEventListener('input', () => {
            console.log('Input event triggered');
            
        const searchTerm = foodInput.value.toLowerCase();
        const filteredItems = Array.from(jsonArray).filter(item =>
        item.FoodItem.toLowerCase().includes(searchTerm));
        renderDropdownItems(filteredItems);
    });

    function renderDropdownItems(items) {
    suggestions.innerHTML = ''; // Clear existing items
    if (items.length === 0) {
        suggestions.innerHTML = '<div>No results found</div>';
    } else {
        items.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item.FoodItem;
            div.addEventListener('click', () => {
                foodInput.value = item.FoodItem;
                suggestions.classList.remove('show');
            });
            suggestions.appendChild(div);
        });
    }
    suggestions.classList.add('show');
}




    fetch('key.json')
      .then(response => response.json())
      .then(data => {
        if (data.apiKey) {
          API_KEY = data.apiKey;
          console.log('API key loaded from key.json (masked):', `${data.apiKey.slice(0,4)}...${data.apiKey.slice(-4)}`);
        }
      })
      .catch(error => {
        console.error('Error fetching key.json:', error);
      });

  
const generateai = document.getElementById('generateai');
generateai.addEventListener('click', callApiWithKey);
  function callApiWithKey() {
    if (!API_KEY) {
      alert('No API key loaded. Please load a key from a local file or set it manually.');
      return;
    }
    // Example: show how to include the key in headers; this is a demo and won't run without a valid key
    console.log('Making demo API call with masked key:', `${API_KEY.slice(0,4)}...${API_KEY.slice(-4)}`);
    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: 'Explain how AI    in a few words' }
            ]
          }
        ]
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Response:', data);
      })
      .catch(err => {
        console.error('Error:', err);
      });
  }

 
});