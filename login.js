"use strict";

document.addEventListener("DOMContentLoaded", function() {
    const user_container = document.getElementsByClassName("main-container")[0];
    const userstats_section = document.getElementById("user-stats");
    const welcome_section = document.getElementById("welcome");
    const aboutUs_section = document.getElementById("about-us");
    const userInfo_section = document.getElementById("user-info");
    const main_section = document.getElementsByClassName("container-wrapper")[0];
    const next_button = document.getElementById("next");
    const previous_button = document.getElementById("previous");
    const clearList_button = document.getElementById("clear-list");
    const foodList = document.getElementById("list");
    const history_section = document.getElementsByClassName("history")[0];
    const listUl = document.getElementById('list');
    const listItems = []



    let current_screen = 0;
    let API_KEY = ''; 

    let user_stats = {
        age: 0,
        sex: "",
        weight: 0,
        height: 0,
        goal: 0
    };

    function getTodayKey() {
    const today = new Date();
    return today.toISOString().split("T")[0];
    }

    function saveToLocalStorage() {
        const key = getTodayKey();
        localStorage.setItem(key, JSON.stringify(listItems));
    }

    function loadFromLocalStorage() {
            const key = getTodayKey();
            const storedData = localStorage.getItem(key);

            if (storedData) {
                const savedList = JSON.parse(storedData);
                
                listItems.length = 0;
                listUl.replaceChildren();
                
                // Add each saved item back
                savedList.forEach(item => {
                    listItems.push(item);
                    const li = document.createElement("li");
                    li.textContent = `${item.name} - ${item.caloriesPer100g.toFixed(2)} cal`;
                    listUl.appendChild(li);
                });
                
            } 
    }

    function loadHistory() {
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - i));
        const dateStr = date.toISOString().split('T')[0];
        
        const historyDiv = document.getElementById(String(i + 1));
        historyDiv.querySelector('h3').textContent = "Date " + (i+1);
        
        const summary = localStorage.getItem(dateStr + '_summary');
        historyDiv.querySelector('p').textContent = summary || 'No summary';
    }
}

    function showScreen(index) {
        // 0 = welcome
        // 1 = about us
        // 2 = user info
        // 3 = user stats
        // 4 = main section
        welcome_section.classList.add("hidden");
        aboutUs_section.classList.add("hidden");
        userInfo_section.classList.add("hidden");
        userstats_section.classList.add("hidden");
        main_section.classList.add("hidden");
        history_section.classList.add("hidden");

        if (index === 0) {
            welcome_section.classList.remove("hidden");
            previous_button.classList.add("hidden");
            next_button.classList.remove("hidden");
        }
        else if (index === 1) {
            aboutUs_section.classList.remove("hidden");
            previous_button.classList.remove("hidden");
        }
        else if (index === 2) {
            userInfo_section.classList.remove("hidden");
            previous_button.classList.remove("hidden");
        }
        else if (index === 3) {
            userstats_section.classList.remove("hidden");
            previous_button.classList.remove("hidden");
        }
        else if (index === 4) {
            main_section.classList.remove("hidden");
            history_section.classList.remove("hidden");
            user_container.classList.add("hidden");
            next_button.classList.add("hidden");
            previous_button.classList.add("hidden");

            loadFromLocalStorage();
            loadHistory();
        }

        current_screen = index;
    }

    showScreen(0);

    userstats_section.addEventListener("input", function(e) {
        if (e.target.id === "weight") user_stats.weight = e.target.value;
        else if (e.target.id === "height") user_stats.height = e.target.value;
        else if (e.target.id === "goal") user_stats.goal = e.target.value;
    });

    userInfo_section.addEventListener("input", function(e) {
        if (e.target.id === "age") user_stats.age = e.target.value;
    })

    userInfo_section.addEventListener("change", function(e) {
        if (e.target.id === "sex") user_stats.sex = e.target.value;
    })

    previous_button.addEventListener("click", function() {
        if (current_screen > 0) {
            showScreen(current_screen - 1);
        }
    });

    next_button.addEventListener("click", function() {
        if (current_screen < 4) {
            showScreen(current_screen + 1);
        }
    });

    clearList_button.addEventListener("click", function() {
        foodList.replaceChildren();
        listItems.length = 0;
    });



    let jsonArray = [];
    fetch('calories.csv')
    .then(response => response.text())
    .then(data => {
        const lines = data.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(h => h.trim());
        jsonArray = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index] || '';
                return obj;
            }, {});
        });
        
        console.log('Calories JSON Array:', jsonArray);
        console.log('First item:', jsonArray[0]);
        console.log('Total items:', jsonArray.length);
    })
    .catch(error => {
        console.error('Error fetching calories.csv:', error);
    });

    const foodInput = document.getElementById('foodInput');
    const suggestions = document.getElementById('suggestions'); 
    
    foodInput.addEventListener('input', () => {
        const searchTerm = foodInput.value.toLowerCase().trim();
        
        // Hide suggestions if input is empty
        if (searchTerm === '') {
            suggestions.classList.remove('show');
            suggestions.innerHTML = '';
            return;
        }
        
        const filteredItems = jsonArray.filter(item => 
            item.FoodItem && item.FoodItem.toLowerCase().includes(searchTerm)
        );
        
        renderDropdownItems(filteredItems);
    });

    function renderDropdownItems(items) {
        suggestions.innerHTML = '';
        
        if (items.length === 0) {
            suggestions.innerHTML = '<div>No results found</div>';
        } else {
            items.forEach(item => {
                const div = document.createElement('div');
                div.textContent = item.FoodItem;
                div.addEventListener('click', () => {
                    foodInput.value = item.FoodItem;
                    suggestions.classList.remove('show');
                    suggestions.innerHTML = '';
                });
                suggestions.appendChild(div);
            });
        }
        suggestions.classList.add('show');
    }

    const addToListBtn = document.getElementById('addToList');
    addToListBtn.addEventListener('click', () => {  
        instructions.classList.add('hidden');
        const foodInput = document.getElementById('foodInput').value.trim();
        const gramsInput = document.getElementById('grams').value.trim();
        const jsonArrayItem = jsonArray.find(item => item.FoodItem.toLowerCase() === foodInput.toLowerCase());
        if (jsonArrayItem && gramsInput){
            const foodItem = { 
                caloriesPer100g: gramsInput/100 * parseFloat(jsonArrayItem.Cals_per100grams),
                name: jsonArrayItem.FoodItem
            };
            listItems.push(foodItem);
            const li = document.createElement('li');
            li.textContent = `${foodItem.name} - ${foodItem.caloriesPer100g.toFixed(2)} cal`;
            listUl.appendChild(li);
            
        }
        document.getElementById('foodInput').value = '';
        document.getElementById('grams').value = '';
    });

    // Load API key
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

    const generateAi = document.getElementById('generateai');
        let summaryArray =[]
    if (generateAi) {
        generateAi.addEventListener('click', callApiWithKey);
    }
    const summaryP = document.getElementById('summary');
    function callApiWithKey() {
        saveToLocalStorage();
        let promptString = `Analyze this person's daily food intake and provide helpful feedback.
        User Information:
            - Age: ${user_stats.age}
            - Sex: ${user_stats.sex}
            - Weight: ${user_stats.weight} kg
            - Height: ${user_stats.height} cm
            - Goal Weight: ${user_stats.goal} kg

            Today's Food Intake:
            ${listItems.map(item => `- ${item.name}: ${item.caloriesPer100g.toFixed(2)} calories`).join('\n')}

            Total Calories: ${listItems.reduce((sum, item) => sum + item.caloriesPer100g, 0).toFixed(2)} calories

            Please provide a 100 word summary including:
            1. Whether their calorie intake aligns with their weight goal
            2. Any nutritional suggestions or observations
            3. Encouragement or tips for reaching their goal`;
        if (!API_KEY) {
            alert('No API key loaded. Please load a key from a local file or set it manually.');
            return;
        }
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
                            { text: promptString }
                        ]
                    }
                ]
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log('Response:', data);
                const aiText = data.candidates[0].content.parts[0].text;
                document.getElementById('summary').textContent = aiText;
                localStorage.setItem(getTodayKey() + '_summary', aiText);
                loadHistory();
        })
        .catch(err => {
            console.error('Error:', err);
        });
    }
});



