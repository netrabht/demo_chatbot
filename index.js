document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chat-box');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  let diseaseData = {};
  let insectData = {};
  let cropVarietyData = {};

  // Function to add a message to the chat
  function addMessage(content, sender) {
    const message = document.createElement('div');
    message.className = `message ${sender}-message`;
    message.textContent = content;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
  }

  // Function to fetch and parse data from all files
  function loadData() {
    const files = [
      { name: 'diseases_name.txt', parser: parseDiseasesData },
      { name: 'insects_name.txt', parser: parseInsectsData },
      { name: 'crop_variety.txt', parser: parseCropVarietyData }, // New file
    ];

    Promise.all(
      files.map((file) =>
        fetch(file.name)
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
          })
          .then((data) => {
            if (file.parser === parseDiseasesData) {
              diseaseData = file.parser(data);
            } else if (file.parser === parseInsectsData) {
              insectData = file.parser(data);
            } else if (file.parser === parseCropVarietyData) {
              cropVarietyData = file.parser(data);
            }
          })
      )
    )
      .then(() => {
        addMessage('ChatBot is ready!', 'bot');
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        addMessage('Failed to load data. Please check the files.', 'bot');
      });
  }

  // Function to parse diseases data
  function parseDiseasesData(data) {
    const lines = data.split('\n');
    const result = {};
    let currentVegetable = '';

    lines.forEach((line) => {
      if (line.startsWith('Vegetable Name')) {
        currentVegetable = line.split(':')[1].trim();
        result[currentVegetable] = [];
      } else if (line.startsWith(' -')) {
        const disease = line.slice(2).trim();
        if (currentVegetable) result[currentVegetable].push(disease);
      }
    });

    return result;
  }

  // Function to parse insects data
  function parseInsectsData(data) {
    const lines = data.split('\n');
    const result = {};
    let currentVegetable = '';

    lines.forEach((line) => {
      if (line.startsWith('Vegetable Name')) {
        currentVegetable = line.split(':')[1].trim();
        result[currentVegetable] = [];
      } else if (line.startsWith(' -')) {
        const insect = line.slice(2).trim();
        if (currentVegetable) result[currentVegetable].push(insect);
      }
    });

    return result;
  }

  // Function to parse crop variety data
  function parseCropVarietyData(data) {
    const lines = data.split('\n');
    const result = {};
    let currentVegetable = '';

    lines.forEach((line) => {
      if (line.startsWith('Vegetable Name')) {
        currentVegetable = line.split(':')[1].trim();
        result[currentVegetable] = [];
      } else if (line.startsWith(' -')) {
        const variety = line.slice(2).trim();
        if (currentVegetable) result[currentVegetable].push(variety);
      }
    });

    return result;
  }

  // Function to handle user input and generate a response
  function handleUserInput(input) {
    const userQuery = input.toLowerCase();
    let found = false;

    // Determine query type
    const isDiseaseQuery = userQuery.includes('disease') || userQuery.includes('diseases');
    const isInsectQuery = userQuery.includes('insect') || userQuery.includes('insects');
    const isVarietyQuery = userQuery.includes('variety') || userQuery.includes('varieties');

    // Search for diseases
    if (isDiseaseQuery) {
      Object.keys(diseaseData).forEach((vegetable) => {
        if (userQuery.includes(vegetable.toLowerCase())) {
          const diseases = diseaseData[vegetable];
          addMessage(`Diseases for ${vegetable}: ${diseases.join(', ')}`, 'bot');
          found = true;
        }
      });
    }

    // Search for insects
    if (isInsectQuery) {
      Object.keys(insectData).forEach((vegetable) => {
        if (userQuery.includes(vegetable.toLowerCase())) {
          const insects = insectData[vegetable];
          addMessage(`Insects for ${vegetable}: ${insects.join(', ')}`, 'bot');
          found = true;
        }
      });
    }

    // Search for crop varieties
    if (isVarietyQuery) {
      Object.keys(cropVarietyData).forEach((vegetable) => {
        if (userQuery.includes(vegetable.toLowerCase())) {
          const varieties = cropVarietyData[vegetable];
          addMessage(`Crop Varieties for ${vegetable}: ${varieties.join(', ')}`, 'bot');
          found = true;
        }
      });
    }

    // No match found
    if (!found) {
      addMessage("Sorry, I couldn't find information on that vegetable.", 'bot');
    }
  }

  // Event listener for send button
  sendButton.addEventListener('click', () => {
    const userMessage = messageInput.value.trim();
    if (userMessage) {
      addMessage(userMessage, 'user');
      handleUserInput(userMessage);
      messageInput.value = '';
    }
  });

  // Load data on startup
  loadData();
});
