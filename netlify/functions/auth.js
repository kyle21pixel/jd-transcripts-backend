exports.handler = async function(event, context) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { username, password } = body;
    if (username === 'admin' && password === 'admin123') {
      return { statusCode: 200, body: JSON.stringify({ success:true, message:'Login successful', token:'mock-jwt-token' }) };
    }
    return { statusCode: 401, body: JSON.stringify({ success:false, message:'Invalid credentials' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success:false, message:err.message }) };
  }
};
