function Success() {
    return (
    <div className="min-w-full">
        <div className="success-container">
            <h1 className="success-title">Success!</h1>
            <p className="success-text">Your submission has been received successfully.</p>
            <button type="button" className="success-button" onClick={() => window.location.href = '/'}>
                Go Home
            </button>
        </div>
    </div>
    );
}

export default Success;