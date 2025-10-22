/**
 * Transcription Service
 * Handles audio file processing and transcription
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config');

class TranscriptionService {
  constructor() {
    this.apiKey = config.transcriptionService.apiKey;
    this.endpoint = config.transcriptionService.endpoint;
  }

  /**
   * Submit audio file for transcription
   * @param {Object} fileInfo - File information object
   * @param {Object} options - Transcription options
   * @returns {Promise} - Promise resolving to transcription job
   */
  async submitTranscription(fileInfo, options = {}) {
    try {
      const filePath = path.join(config.uploads.storageDir, fileInfo.fileName);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error('Audio file not found');
      }
      
      // Create form data with file and options
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      formData.append('language', options.language || 'en');
      
      if (options.speakers) {
        formData.append('speakers', options.speakers);
      }
      
      // Submit to transcription API
      const response = await axios.post(`${this.endpoint}/transcribe`, formData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        jobId: response.data.jobId,
        status: response.data.status,
        estimatedTime: response.data.estimatedTime
      };
    } catch (error) {
      console.error('Transcription submission error:', error);
      throw new Error(`Failed to submit transcription: ${error.message}`);
    }
  }

  /**
   * Check transcription job status
   * @param {string} jobId - Transcription job ID
   * @returns {Promise} - Promise resolving to job status
   */
  async checkStatus(jobId) {
    try {
      const response = await axios.get(`${this.endpoint}/status/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Check transcription status error:', error);
      throw new Error(`Failed to check transcription status: ${error.message}`);
    }
  }

  /**
   * Get completed transcription result
   * @param {string} jobId - Transcription job ID
   * @returns {Promise} - Promise resolving to transcription result
   */
  async getResult(jobId) {
    try {
      const response = await axios.get(`${this.endpoint}/result/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get transcription result error:', error);
      throw new Error(`Failed to get transcription result: ${error.message}`);
    }
  }

  /**
   * Mock transcription for development/testing
   * @param {Object} fileInfo - File information object
   * @returns {Object} - Mock transcription result
   */
  mockTranscription(fileInfo) {
    // Generate random job ID
    const jobId = `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Mock transcription text based on filename
    const mockText = `This is a mock transcription for file: ${fileInfo.originalName}. 
    The transcription service is currently in development mode.
    
    Speaker 1: Hello, this is a test recording.
    Speaker 2: Yes, I can hear you clearly.
    Speaker 1: Great! Let's proceed with the meeting.
    Speaker 2: Sounds good to me.`;
    
    return {
      jobId,
      status: 'completed',
      text: mockText,
      confidence: 0.95,
      speakers: [
        { id: 'speaker_1', name: 'Speaker 1' },
        { id: 'speaker_2', name: 'Speaker 2' }
      ],
      segments: [
        { start: 0, end: 5.2, speaker: 'speaker_1', text: 'Hello, this is a test recording.' },
        { start: 5.8, end: 8.5, speaker: 'speaker_2', text: 'Yes, I can hear you clearly.' },
        { start: 9.1, end: 12.7, speaker: 'speaker_1', text: 'Great! Let\'s proceed with the meeting.' },
        { start: 13.2, end: 15.5, speaker: 'speaker_2', text: 'Sounds good to me.' }
      ]
    };
  }
}

module.exports = new TranscriptionService();