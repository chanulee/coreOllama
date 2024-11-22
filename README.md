# coreOllama
The most easy-to-use, simple and lightweight interface to run your local LLM, for everyone. 

<div align="center"><img src="https://i.ibb.co/sjgbqpJ/Ollama-Web-Interface.jpg" alt="Ollama Web Interface"></div>

## Features
- Generate
  - model selection
  - temperature
  - Image input for [llama3.2-vision:latest](https://ollama.com/library/llama3.2-vision)
- Model Management
  - View and delete models
  - Pull new model
- Local server status
- Dark mode
- Include Context: Full or selection
- Clear chat history

## Versions
- 0-basic: Basic proof of concept of ollama-gui
- chat: main project
#### Advanced Apps
- [persona-studio](https://github.com/chanulee/persona-studio): Build and manage your own personas
- [everychat](https://github.com/chanulee/everychat): your AI chat multiverse

## Beginner's guide
1. Ollama setup - install ollama app for mac (You can download model or just proceed and use gui)
2. Quit the app (check on your status bar). 
3. Open terminal and enter `ollama serve`. Keep that terminal window open.
4. Check http://localhost:11434/, it should say "Ollama is running".
5. Download the repo and open `web/chat/index.html`
