// API service for LeadGen Pro backend integration
const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Dashboard stats
  async getDashboardStats() {
    return this.request('/api/dashboard/stats');
  }

  // Leads
  async getLeads(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/leads${query ? `?${query}` : ''}`);
  }

  async getCallQueue() {
    return this.request('/api/leads/call-queue');
  }

  async getLeadStats() {
    return this.request('/api/leads/stats');
  }

  async createLead(leadData) {
    return this.request('/api/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  async updateLeadStatus(leadId, status, notes = null) {
    return this.request(`/api/leads/${leadId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Automation
  async getAutomationSequences() {
    return this.request('/api/automation/sequences');
  }

  async getAutomationStats() {
    return this.request('/api/automation/stats');
  }

  async getAutomationPerformance() {
    return this.request('/api/automation/performance');
  }

  async createAutomationSequence(sequenceData) {
    return this.request('/api/automation/sequences', {
      method: 'POST',
      body: JSON.stringify(sequenceData),
    });
  }

  async updateSequenceStatus(sequenceId, status) {
    return this.request(`/api/automation/sequences/${sequenceId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async pauseSequence(sequenceId) {
    return this.request(`/api/automation/sequences/${sequenceId}/pause`, {
      method: 'POST',
    });
  }

  async resumeSequence(sequenceId) {
    return this.request(`/api/automation/sequences/${sequenceId}/resume`, {
      method: 'POST',
    });
  }

  // Contracts
  async getContracts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/contracts${query ? `?${query}` : ''}`);
  }

  async getContractStats() {
    return this.request('/api/contracts/stats');
  }

  async createContract(contractData) {
    return this.request('/api/contracts', {
      method: 'POST',
      body: JSON.stringify(contractData),
    });
  }

  async updateContractStatus(contractId, status, data = {}) {
    return this.request(`/api/contracts/${contractId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, ...data }),
    });
  }

  async markCommissionPaid(contractId) {
    return this.request(`/api/contracts/${contractId}/commission/paid`, {
      method: 'PUT',
    });
  }

  async updateContractMetrics(contractId, metrics) {
    return this.request(`/api/contracts/${contractId}/metrics`, {
      method: 'PUT',
      body: JSON.stringify(metrics),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService(); 