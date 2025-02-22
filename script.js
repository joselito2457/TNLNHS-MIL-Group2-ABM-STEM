const GROUP_PASSWORD = "group2"; // Change this password
let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

function handleAuth() {
    const input = document.getElementById('member-password').value;
    if (input === GROUP_PASSWORD) {
        isAuthenticated = true;
        localStorage.setItem('isAuthenticated', 'true');
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('member-section').style.display = 'block';
        document.getElementById('auth-btn').textContent = 'Logout';
    } else {
        alert('Incorrect password!');
    }
}

function handleLogout() {
    isAuthenticated = false;
    localStorage.removeItem('isAuthenticated');
    document.getElementById('member-section').style.display = 'none';
    document.getElementById('auth-btn').textContent = 'Member Login';
    document.getElementById('login-modal').style.display = 'flex';
}

function submitPost() {
    var writerName = document.getElementById('writer-name').value;
    var insight = document.getElementById('insight-input').value;
    var perception = document.getElementById('perception-input').value;

    if (insight) {
        addPost('insights', writerName, insight);
        document.getElementById('insight-input').value = '';
    }

    if (perception) {
        addPost('perceptions', writerName, perception);
        document.getElementById('perception-input').value = '';
    }

    document.getElementById('writer-name').value = '';
}

function addPost(type, writerName, content) {
    var post = {
        writerName: writerName,
        content: content
    };

    var posts = JSON.parse(localStorage.getItem(type)) || [];
    posts.push(post);
    localStorage.setItem(type, JSON.stringify(posts));

    displayPost(type, post);
}

function displayPost(type, post) {
    var container = document.getElementById(type + '-container');
    var postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = '<p><strong>' + capitalizeFirstLetter(type.slice(0, -1)) + ':</strong> ' + post.content + '</p><p><em>Written by: ' + post.writerName + '</em></p><button onclick="deletePost(this, \'' + type + '\')">Delete</button>';
    container.appendChild(postElement);
}

function loadPosts() {
    ['insights', 'perceptions'].forEach(type => {
        var posts = JSON.parse(localStorage.getItem(type)) || [];
        posts.forEach(post => displayPost(type, post));
    });
}

function deletePost(button, type) {
    if (confirm('Are you sure you want to delete this post?')) {
        var postElement = button.parentElement;
        var container = postElement.parentElement;
        container.removeChild(postElement);

        var posts = JSON.parse(localStorage.getItem(type)) || [];
        var index = Array.from(container.children).indexOf(postElement);
        posts.splice(index, 1);
        localStorage.setItem(type, JSON.stringify(posts));
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize on load
window.addEventListener('load', () => {
    if (isAuthenticated) {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('member-section').style.display = 'block';
        document.getElementById('auth-btn').textContent = 'Logout';
    } else {
        document.getElementById('login-modal').style.display = 'flex';
    }
    loadPosts();
});

// Initialize Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

// Observe all content cards
document.querySelectorAll('.content-card').forEach(card => {
    observer.observe(card);
});

// Smooth scroll functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Dynamic header animation
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.frost-nav');
    if (window.scrollY > 50) {
        nav.style.transform = 'translateY(-10px)';
        nav.style.opacity = '0.9';
    } else {
        nav.style.transform = 'translateY(0)';
        nav.style.opacity = '1';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const scrollElements = document.querySelectorAll('.scroll-animation');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    handleScrollAnimation();
});

document.addEventListener('DOMContentLoaded', function() {
    loadPosts();

    document.getElementById('submit-button').addEventListener('click', submitPost);
});