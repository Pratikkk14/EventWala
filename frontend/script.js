import * as THREE from 'three';

// --- UI Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const signupView = document.getElementById('signup-view');
    const loginView = document.getElementById('login-view');
    const loginLink = document.getElementById('login-link');
    const createAccountLink = document.getElementById('create-account-link');
    const togglePassword = document.getElementById('togglePassword');
    const signupPassword = document.getElementById('signup-password');
    const eyeOpen = document.getElementById('eye-open');
    const eyeClosed = document.getElementById('eye-closed');
    const signupForm = document.getElementById('signup-form');
    const googleBtnSignup = document.getElementById('google-btn-signup');
    const appleBtnSignup = document.getElementById('apple-btn-signup');
    const loginForm = document.getElementById('login-form');

    // Switch between login/signup views
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupView.classList.add('hidden');
        loginView.classList.remove('hidden');
    });

    createAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.add('hidden');
        signupView.classList.remove('hidden');
    });

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = signupPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        signupPassword.setAttribute('type', type);
        eyeOpen.classList.toggle('hidden');
        eyeClosed.classList.toggle('hidden');
    });

    // Signup form validation
    // Signup form validation
signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const terms = document.getElementById('terms').checked;

    // Remove existing error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    const gmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@.]+(\.[^\s@.]+)*$/;
    // At least 8 characters, only allowed chars
    const allowedSpecials = "!@#$%^&*()-_=+[]{};:'\",.<>?/`~|";
    const allowedChars = "a-zA-Z0-9" + allowedSpecials.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const passwordRegex = new RegExp("^[" + allowedChars + "]{8,}$");
    // At least one letter
    const hasLetter = /[a-zA-Z]/;
    // At least one number
    const hasNumber = /[0-9]/;
    // At least one special character
    const hasSpecial = /[!@#$%^&*()\-\_=+\[\]{};:'",.<>?/`~|]/;

    let isValid = true;

    if (!gmailRegex.test(email)) {
        showError('signup-email', 'Please enter a valid Gmail address.');
        isValid = false;
    }

    // Password validation
    if (
        !passwordRegex.test(password) ||
        !hasLetter.test(password) ||
        !hasNumber.test(password) ||
        !hasSpecial.test(password)
    ) {
        showError(
            'signup-password',
            'Password must be at least 8 characters, contain letters, numbers, and at least one special character.'
        );
        isValid = false;
    }

    if (!terms) {
        showError('terms', 'You must agree to the Terms & Conditions.');
        isValid = false;
    }

    if (!isValid) return;

    console.log('Creating account with:', { firstName, lastName, email });
    alert('Account created successfully!');
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
});


    // Show inline error below input
    function showError(elementId, message) {
        const input = document.getElementById(elementId);
        const error = document.createElement('p');
        error.className = 'text-sm text-red-500 mt-1 error-message';
        error.textContent = message;
        input.parentElement.appendChild(error);
    }

    // Login form (can also add validation here if needed)
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        console.log('Logging in with email:', email);
        alert('Login submitted');
    });

    // Social login buttons (optional actions)
    googleBtnSignup.addEventListener('click', () => console.log('Initiating Google registration...'));
    appleBtnSignup.addEventListener('click', () => console.log('Initiating Apple registration...'));
});

// --- 3D Animation Logic ---
let scene, camera, renderer, particles;
const canvas = document.getElementById('bg-canvas');
const mouse = new THREE.Vector2();

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setClearColor(0x232228, 1); // Match background

    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--main-purple'));
    const color2 = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--link-purple'));

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;

        const mixedColor = color1.clone().lerp(color2, Math.random());
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    onWindowResize();
}

function onWindowResize() {
    const container = canvas.parentElement;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.0001;

    particles.rotation.y = time * 0.5;

    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

init3D();
animate();
