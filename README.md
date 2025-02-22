# Shoutout - AI Video Generation Platform

A comprehensive platform for generating, managing, and publishing AI-powered videos. This project combines video processing, lip-syncing, text-to-speech, and YouTube integration to create engaging content automatically.

## Features

- 🎥 Video Generation with AI Lip-Sync
- 🔊 Text-to-Speech Audio Generation
- 📄 PDF Content Summarization
- 📺 Automatic YouTube Publishing
- 🎨 Modern Web Interface
- 🔒 Secure API Integration

## Project Structure

```
shoutout/
├── frontend/          # Next.js web application
├── backend/          # FastAPI backend server
├── docs/            # API and usage documentation
├── data/            # Data storage directory
├── input_files/     # Input files for processing
├── output_videos/   # Processed video outputs
├── generated_videos/ # AI-generated video files
├── converted_files/ # Format-converted files
└── generated_images/ # Generated image assets
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- FFmpeg
- Google Cloud Project (for YouTube API)
- OpenAI API Key
- FAL AI API Key

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shoutout.git
cd shoutout
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Start the backend server:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

4. Start the frontend application:
```bash
cd frontend
npm install
npm run dev
```

5. Open http://localhost:3000 in your browser

## Documentation

- [API Documentation](docs/README.md)
- [Frontend Guide](frontend/README.md)
- [Backend Guide](backend/README.md)
- [Example Usage](docs/examples.md)

## Development

### Backend Development
The backend is built with FastAPI and provides:
- Video processing endpoints
- YouTube integration
- File management
- Authentication

### Frontend Development
The frontend is built with Next.js and features:
- Modern UI/UX
- Real-time processing status
- File upload interface
- Video preview capabilities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
