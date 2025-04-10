class DeepSeekService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/deepseek';
    this.apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
  }

  /**
   * Phân tích code sử dụng DeepSeek API
   * @param {string} code - Code cần phân tích
   * @param {string} language - Ngôn ngữ lập trình (js, python, java, etc.)
   * @param {boolean} includeExplanations - Có bao gồm giải thích chi tiết
   * @returns {Promise<Array>} Mảng các đề xuất
   */
  async analyzeCode(code, language = 'js', includeExplanations = true) {
    try {
      const response = await fetch(`${this.baseURL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          includeExplanations,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi phân tích mã');
      }

      const data = await response.json();
      return data.suggestions;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }

  /**
   * Áp dụng đề xuất vào đoạn code
   * @param {string} code - Code gốc
   * @param {Object} suggestion - Đề xuất cần áp dụng
   * @returns {Promise<Object>} Kết quả áp dụng đề xuất
   */
  async applySuggestion(code, suggestion) {
    try {
      const response = await fetch(`${this.baseURL}/apply-suggestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          suggestion,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi áp dụng đề xuất');
      }

      return await response.json();
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }
}

// Tạo một instance duy nhất và export
const deepseekService = new DeepSeekService();
export { deepseekService };
