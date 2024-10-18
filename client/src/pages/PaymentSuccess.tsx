// // src/components/ThankYouPage.tsx

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './ThankYouPage.scss';

// type OrderDetailsProps = {
//   orderNumber: string;
//   orderDate: string;
//   total: string;
//   status: string;
// };

// const PaymentSuccess: React.FC<OrderDetailsProps> = ({
//   orderNumber,
//   orderDate,
//   total,
//   status,
// }) => {
//   const navigate = useNavigate();

//   const handleGoHome = () => {
//     navigate('/');
//   };

//   return (
//     <div className="thank-you-page">
//       <div className="thank-you-container">
//         <div className="success-icon">&#10004;</div>
//         <h1>Thank you for your order!</h1>
//         <p>Your order was successfully placed and is being processed.</p>
//         <div className="order-details">
//           <h2>Order Details</h2>
//           <p><strong>Order Number:</strong> {orderNumber}</p>
//           <p><strong>Order Date:</strong> {orderDate}</p>
//           <p><strong>Total:</strong> {total}</p>
//           <p><strong>Status:</strong> <span className={`status ${status.toLowerCase()}`}>{status}</span></p>
//         </div>
//         <button className="go-home-btn" onClick={handleGoHome}>
//           Return to Homepage
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;


// src/components/ThankYouPage.tsx

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/ThankYouPage.scss';

const PaymentSuccess: React.FC = () => {
    const searchParams = useSearchParams()[0];
    
    const referenceNumber = searchParams.get('reference');
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        <div className="success-icon">&#10004;</div>
        <h1>Thank you for your order!</h1>
        <p>Your order was successfully placed and is being processed.</p>
        <div className="order-details">
          <h2>Order Details</h2>
          <p><strong>Order Number:</strong> 123456789</p>
          <p><strong>Reference Number:</strong>{referenceNumber}</p>
          <p><strong>Order Date:</strong> December 14, 2023</p>
          <p><strong>Total:</strong> $150.00</p>
          <p><strong>Status:</strong> <span className="status processing">Processing</span></p>
        </div>
        <button className="go-home-btn" onClick={handleGoHome}>
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
