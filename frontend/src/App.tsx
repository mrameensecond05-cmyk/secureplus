import React from 'react'

function App() {
    return (
        <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
            <h1>SecurePulse SIEM</h1>
            <p>Welcome to the SecurePulse Dashboard.</p>
            <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
                <h2>System Status</h2>
                <p>Frontend: <strong>Active</strong></p>
                <p>API Gateway: <strong>Connecting...</strong> (TODO)</p>
            </div>
        </div>
    )
}

export default App
