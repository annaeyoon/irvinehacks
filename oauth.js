window.onload = () => {
    console.log("Google Sign-In script loaded and onload event fired");

    google.accounts.id.initialize({
        client_id: '221056568245-kmrcqe72p95bfd8ddlik0v1vb1eioklq.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });

    google.accounts.id.prompt(); // This will prompt the user to sign in if they aren't signed in yet
};

function handleCredentialResponse(response) {
    console.log("Google response received:", response);

    const responsePayload = decodeJwtResponse(response.credential);
    console.log('Logged in as: ' + responsePayload.name);

    document.getElementById('profile').innerHTML = `
        <p>Name: ${responsePayload.name}</p>
        <p>Email: ${responsePayload.email}</p>
        <img src="${responsePayload.picture}" alt="Profile Picture">
    `;
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
