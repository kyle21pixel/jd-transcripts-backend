exports.handler = async function(event, context) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { name, email, message } = body;
    if (!email || !message) {
      return { statusCode: 400, body: JSON.stringify({ success:false, message:'Email and message required' }) };
    }
    // In production, send email or store submission
    console.log('Contact submission:', { name, email, message });
    return { statusCode: 200, body: JSON.stringify({ success:true, message:'Contact form received' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success:false, message:err.message }) };
  }
};
