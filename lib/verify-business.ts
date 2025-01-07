export async function verifyBusiness(businessName: string, taxId: string) {
  // In a real-world scenario, this would make an API call to an external service
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a response
      resolve({
        verified: Math.random() > 0.3, // 70% chance of verification success
        reason: Math.random() > 0.3 ? 'Business verified successfully' : 'Unable to verify business information'
      })
    }, 2000) // Simulate a 2-second delay
  })
}

