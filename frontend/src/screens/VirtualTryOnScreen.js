// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const VirtualTryOnScreen = () => {
//   const [personImage, setPersonImage] = useState(null);
//   const [garmentImage, setGarmentImage] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handlePersonImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => setPersonImage(e.target.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleGarmentImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => setGarmentImage(e.target.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleTryOn = async () => {
//     if (!personImage || !garmentImage) {
//       alert('Please upload both person and garment images');
//       return;
//     }

//     setLoading(true);

//     try {
//       // Convert base64 data URLs to blobs
//       const personBlob = await fetch(personImage).then(res => res.blob());
//       const garmentBlob = await fetch(garmentImage).then(res => res.blob());

//       // Prepare form data
//       const formData = new FormData();
//       formData.append('person_image', personBlob, 'person.png');
//       formData.append('garment_image', garmentBlob, 'garment.png');

//       // Call Hugging Face IDM-VTON Space API
//       const response = await fetch(
//         'https://huggingface.co/spaces/yisol/IDM-VTON/api/predict',
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );

//       const data = await response.json();

//       // The response should contain the result image URL or base64
//       if (data && data.data && data.data[0]) {
//         setResult(data.data[0]); // This should be the image URL or base64

//         // Store the result in cookies (expires in 1 day)
//         document.cookie = `tryon_result=${encodeURIComponent(data.data[0])}; path=/; max-age=86400`;
//       } else {
//         alert('Try-on failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Try-on failed:', error);
//       alert('Try-on failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="screen">
//         <div className="header">
//           <h1>📸 Virtual Try-On</h1>
//           <p>See how clothes look on you with AI</p>
//         </div>

//         <div className="card">
//           <h3>Upload Your Photo</h3>
//           <div 
//             className="image-upload"
//             onClick={() => document.getElementById('person-upload').click()}
//           >
//             {personImage ? (
//               <img src={personImage} alt="Person" className="image-preview" />
//             ) : (
//               <div>
//                 <div style={{ fontSize: '48px', marginBottom: '10px' }}>👤</div>
//                 <p>Tap to upload your photo</p>
//                 <p style={{ fontSize: '12px', color: '#666' }}>
//                   Best results with full-body photos
//                 </p>
//               </div>
//             )}
//           </div>
//           <input
//             id="person-upload"
//             type="file"
//             accept="image/*"
//             onChange={handlePersonImageUpload}
//             style={{ display: 'none' }}
//           />
//         </div>

//         <div className="card">
//           <h3>Upload Garment</h3>
//           <div 
//             className="image-upload"
//             onClick={() => document.getElementById('garment-upload').click()}
//           >
//             {garmentImage ? (
//               <img src={garmentImage} alt="Garment" className="image-preview" />
//             ) : (
//               <div>
//                 <div style={{ fontSize: '48px', marginBottom: '10px' }}>👕</div>
//                 <p>Tap to upload garment photo</p>
//                 <p style={{ fontSize: '12px', color: '#666' }}>
//                   Clear photos work best
//                 </p>
//               </div>
//             )}
//           </div>
//           <input
//             id="garment-upload"
//             type="file"
//             accept="image/*"
//             onChange={handleGarmentImageUpload}
//             style={{ display: 'none' }}
//           />
//         </div>

//         <button 
//           className="btn btn-primary"
//           onClick={handleTryOn}
//           disabled={loading || !personImage || !garmentImage}
//         >
//           {loading ? (
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
//               <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
//               Processing...
//             </div>
//           ) : (
//             '✨ Try On'
//           )}
//         </button>

//         {result && (
//           <div className="card">
//             <h3>🎉 Try-On Result</h3>
//             <img src={result} alt="Try-on result" className="image-preview" />
//             <div style={{ marginTop: '15px' }}>
//               <button className="btn btn-secondary">💾 Save Result</button>
//               <button className="btn btn-secondary">📤 Share</button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* <div className="bottom-nav">
//         <Link to="/" className="nav-item">
//           <div className="nav-icon">🏠</div>
//           <div>Home</div>
//         </Link>
//         <Link to="/virtual-tryon" className="nav-item active">
//           <div className="nav-icon">📸</div>
//           <div>Try-On</div>
//         </Link>
//         <Link to="/ai-style" className="nav-item">
//           <div className="nav-icon">🤖</div>
//           <div>AI Style</div>
//         </Link>
//       </div> */}
//     </div>
//   );
// };

// export default VirtualTryOnScreen;


import React from 'react';

const VirtualTryOnScreen = () => {
  return (
    <div className="container">
      <div className="screen">
        <div className="header">
          <h1>📸 Virtual Try-On</h1>
          <p>See how clothes look on you with AI</p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '15px',
          margin: '20px'
        }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>
            🚧
          </div>
          <h2>This feature is coming soon!</h2>
          <p style={{ maxWidth: '300px', lineHeight: '1.5' }}>
            Our team is hard at work to bring you an amazing virtual try-on experience. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOnScreen;