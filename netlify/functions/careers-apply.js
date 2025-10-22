exports.handler = async function(event, context) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { name, email, position, resumeText } = body;
    if (!name || !email || !position) {
      return { statusCode: 400, body: JSON.stringify({ success:false, message:'Name, email, position required' }) };
    }
    console.log('Application received:', { name, email, position });
    return { statusCode: 200, body: JSON.stringify({ success:true, message:'Application received' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success:false, message:err.message }) };
  }
};
