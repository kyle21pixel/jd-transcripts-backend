exports.handler = async function(event, context) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { orderId, email } = body;
    if (!orderId || !email) {
      return { statusCode: 400, body: JSON.stringify({ success:false, message:'orderId and email required' }) };
    }

    const today = new Date();
    const orderDate = new Date(today);
    orderDate.setDate(today.getDate() - 3);
    const estimatedCompletion = new Date(today);
    estimatedCompletion.setDate(today.getDate() + 2);

    const data = {
      orderId,
      email,
      serviceType: 'Legal Transcription',
      orderDate: orderDate.toISOString(),
      status: 'In Progress',
      estimatedCompletion: estimatedCompletion.toISOString(),
      amount: 150.00,
      timeline: [
        { date: orderDate.toISOString(), status: 'Order Received', description: 'Order received and queued.', completed: true, current: false },
        { date: new Date(orderDate.getTime() + 24*60*60*1000).toISOString(), status: 'Processing Started', description: 'Transcription team started work.', completed: true, current: false },
        { date: new Date(orderDate.getTime() + 48*60*60*1000).toISOString(), status: 'In Progress', description: 'Currently being transcribed.', completed: false, current: true },
        { date: estimatedCompletion.toISOString(), status: 'Quality Check', description: 'Quality assurance review.', completed: false, current: false },
        { date: new Date(estimatedCompletion.getTime() + 24*60*60*1000).toISOString(), status: 'Completed', description: 'Delivered to customer.', completed: false, current: false }
      ]
    };

    return { statusCode: 200, body: JSON.stringify({ success:true, data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success:false, message:err.message }) };
  }
};
