const APP_ID = "986d132e439f4d42afe179e691cb47b8";
const TOKEN = "007eJxTYDjq5rgmp/ya64+azO2vt83v22jyyeZ0T3X8dx3fc++uXPqgwGBpYZZiaGyUamJsmWaSYmKUmJZqaG6ZamZpmJxkYp5k8fbWlPSGQEYGvXPBzIwMEAjiszDkJmbmMTAAAHxyI6o=";
const CHANNEL = "main";

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

let localTracks = [];
let remoteUsers = {};

let joinAndDisplayLocalStream = async () => {
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null);

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

    let player = `<div class="video-container" id="user-container-${UID}">
                    <div class="video-player" id="user-${UID}"></div>
                  </div>`;
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);

    localTracks[1].play(`user-${UID}`);

    await client.publish([localTracks[0], localTracks[1]]);
};

let joinStream = async () => {
    // Hide the room creation buttons before joining
    document.getElementById('join-btn').style.display = 'none';
    document.getElementById('stream-controls').style.display = 'flex';

    // Hide the "Create Room" section (button and text)
    let createRoomSection = document.getElementById('create-room-section');
    if (createRoomSection) {
        createRoomSection.style.display = 'none';
    }
    
    // Hide Mic and Camera buttons initially when entering the stream
    document.getElementById('mic-btn').style.display = 'block';
    document.getElementById('camera-btn').style.display = 'block';
    document.getElementById('leave-btn').style.display = 'block';

    await joinAndDisplayLocalStream();
};

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user;
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
        let player = document.getElementById(`user-container-${user.uid}`);
        if (player != null) {
            player.remove();
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div> 
                 </div>`;
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);

        user.videoTrack.play(`user-${user.uid}`);
    }

    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
};

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid];
    document.getElementById(`user-container-${user.uid}`).remove();
};

let leaveAndRemoveLocalStream = async () => {
    for (let i = 0; localTracks.length > i; i++) {
        localTracks[i].stop();
        localTracks[i].close();
    }

    await client.leave();
    document.getElementById('join-btn').style.display = 'block';
    document.getElementById('stream-controls').style.display = 'none';
    document.getElementById('video-streams').innerHTML = '';

    // Show the "Create Room" section (button and text) again
    let createRoomSection = document.getElementById('create-room-section');
    if (createRoomSection) {
        createRoomSection.style.display = 'block';
    }

    // Hide the Mic and Camera buttons and Leave button after leaving
    document.getElementById('mic-btn').style.display = 'none';
    document.getElementById('camera-btn').style.display = 'none';
    document.getElementById('leave-btn').style.display = 'none';
};

let toggleMic = async (e) => {
    if (localTracks[0].muted) {
        await localTracks[0].setMuted(false);
        e.target.innerText = 'Mic on';
        e.target.style.backgroundColor = 'cadetblue';
    } else {
        await localTracks[0].setMuted(true);
        e.target.innerText = 'Mic off';
        e.target.style.backgroundColor = '#EE4B2B';
    }
};

let toggleCamera = async (e) => {
    if (localTracks[1].muted) {
        await localTracks[1].setMuted(false);
        e.target.innerText = 'Camera on';
        e.target.style.backgroundColor = 'cadetblue';
    } else {
        await localTracks[1].setMuted(true);
        e.target.innerText = 'Camera off';
        e.target.style.backgroundColor = '#EE4B2B';
    }
};

// Hide the controls before joining the stream
document.getElementById('mic-btn').style.display = 'none';
document.getElementById('camera-btn').style.display = 'none';
document.getElementById('leave-btn').style.display = 'none';

document.getElementById('join-btn').addEventListener('click', joinStream);
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream);
document.getElementById('mic-btn').addEventListener('click', toggleMic);
document.getElementById('camera-btn').addEventListener('click', toggleCamera);
