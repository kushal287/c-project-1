// Utility to load and initialize Razorpay
export const initializeRazorpay = () => {
    return new Promise((resolve) => {
        // If already loaded
        if ((window as any).Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export const makePayment = async (amount: number, eventId: string, type: 'advance' | 'final', onSuccess: () => void) => {
    const res = await initializeRazorpay();

    if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
    }

    // In a real app, you would fetch `orderId` from your backend here.
    // This is a dummy initialization for demo purposes.
    const options = {
        key: 'rzp_test_YOUR_KEY_HERE',
        amount: amount * 100, // in paise
        currency: 'INR',
        name: 'JashanEdge',
        description: `${type.toUpperCase()} Payment for Event ${eventId}`,
        image: '/logo.jpg', // Placeholder
        order_id: 'order_9A33XWu170gUtm', // Replace with real generated order ID
        handler: function (response: any) {
            console.log('Payment Success:', response.razorpay_payment_id);
            onSuccess();
        },
        prefill: {
            name: 'Kushal',
            email: 'kushal@example.com',
            contact: '9999999999',
        },
        notes: {
            address: 'JashanEdge Corporate Office',
        },
        theme: {
            color: '#C8963E', // JashanEdge primary gold
        },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
};
