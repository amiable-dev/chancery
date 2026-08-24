# GitHub - jason8745/llm-agent-trader: AI-powered stock trading backtesting system with LLM-based decision analysis, FastAPI backend, and Next.js frontend.

**Source:** https://github.com/jason8745/llm-agent-trader
**Added:** 2026-08-24
**Tags:** #unsorted

---

> AI-powered stock trading backtesting system with LLM-based decision analysis, FastAPI backend, and Next.js frontend. - jason8745/llm-agent-trader

---

[![star](https://github.com/jason8745/llm-agent-trader/raw/master/star-history-20251112.png)](https://github.com/jason8745/llm-agent-trader/blob/master/star-history-20251112.png)

AI-powered stock trading backtesting system that integrates Large Language Models for intelligent trading decision analysis. [![alt text](https://github.com/jason8745/llm-agent-trader/raw/master/image.png)](https://github.com/jason8745/llm-agent-trader/blob/master/image.png) [![alt text](https://github.com/jason8745/llm-agent-trader/raw/master/image-1.png)](https://github.com/jason8745/llm-agent-trader/blob/master/image-1.png) [![alt text](https://github.com/jason8745/llm-agent-trader/raw/master/image-3.png)](https://github.com/jason8745/llm-agent-trader/blob/master/image-3.png)

## System Architecture

[](#system-architecture)

flowchart TD
    %% User Interface Layer
    A\[Frontend - Next.js\] --> B\[API Gateway - FastAPI Backend\]
    
    %% Main Function Modules
    B --> C\[LLM Streaming Backtest Engine\]
    B --> D\[Backtest Analysis API\]
    B --> E\[Daily Feedback API\]
    
    %% Data Layer
    F\[Stock Data Service<br/>YFinance\] --> C
    G\[SQLite Database<br/>Backtest Logs\] --> D
    G --> E
    
    %% LLM Strategy Engine
    C --> H\[LLM Smart Strategy\]
    H --> I\[Azure OpenAI<br/>GPT-4\]
    H --> J\[Technical Analysis Engine\]
    H --> K\[Risk Management Module\]
    
    %% Backtest Execution Flow
    C --> L\[Trading Signal Generation\]
    L --> M\[Performance Calculation\]
    M --> N\[Result Recording\]
    N --> G
    
    %% Style Definitions
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef llm fill:#fff3e0
    classDef data fill:#e8f5e8
    
    class A frontend
    class B,C,D,E backend
    class H,I,J,K llm
    class F,G data

Loading

## Quick Start

[](#quick-start)

### Prerequisites

[](#prerequisites)

-   **macOS/Linux**: Native support for `make` commands
-   **Windows**: May require additional setup (WSL, Git Bash, or make utility installation)

### Install Dependencies

[](#install-dependencies)

make install

### Environment Setup

[](#environment-setup)

Copy and configure your `.env` file:

cp .env.example .env

**Switch LLM Provider**: Edit `.env` and comment/uncomment the API keys:

# Use Azure OpenAI (default)
AZURE\_OPENAI\_API\_KEY\=your\_key
# GOOGLE\_API\_KEY=your\_key  # comment out

# Use Google Gemini instead
# AZURE\_OPENAI\_API\_KEY=your\_key  # comment out  
GOOGLE\_API\_KEY\=your\_key

### Development Mode

[](#development-mode)

make run

**🎉 Success!** After setup, open your browser and navigate to: **[http://localhost:3000](http://localhost:3000/)** to access the web application

### Other Commands

[](#other-commands)

make stop     # Stop all services
make test     # Run tests
make clean    # Clean cache files
make format   # Format code

### Windows Users

[](#windows-users)

If you encounter issues with `make` commands on Windows, consider:

-   **WSL (Windows Subsystem for Linux)**: Recommended approach
-   **Git Bash**: Included with Git for Windows
-   **Make for Windows**: Install GNU Make utility
