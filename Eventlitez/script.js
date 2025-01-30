// DOM Elements
const modal = document.getElementById('eventModal');
const createEventBtn = document.getElementById('createEventBtn');
const closeBtn = document.querySelector('.close');
const eventForm = document.getElementById('eventForm');
const eventsList = document.getElementById('eventsList');

// Event Listeners
createEventBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Load events from localStorage
let events = JSON.parse(localStorage.getItem('events')) || [];

// Event Form Submission
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newEvent = {
        id: Date.now(),
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value
    };

    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
    
    displayEvents();
    eventForm.reset();
    modal.style.display = 'none';
});

// Add animation when creating new events
function animateEventCreation(eventCard) {
    eventCard.style.opacity = '0';
    eventCard.style.transform = 'translateY(20px) scale(0.9)';
    
    setTimeout(() => {
        eventCard.style.transition = 'all 0.5s ease-out';
        eventCard.style.opacity = '1';
        eventCard.style.transform = 'translateY(0) scale(1)';
    }, 50);
}

// Create shooting stars
function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    
    // Random position
    star.style.top = `${Math.random() * window.innerHeight}px`;
    star.style.left = `${Math.random() * window.innerWidth}px`;
    
    document.body.appendChild(star);
    
    // Remove star after animation
    setTimeout(() => {
        star.remove();
    }, 2000);
}

// Create shooting stars periodically
setInterval(createShootingStar, 3000);

// Update character emojis based on event type
function updateEventEmoji(eventName) {
    const eventEmojis = {
        'party': '🎉',
        'concert': '🎵',
        'meeting': '💼',
        'sports': '⚽',
        'birthday': '🎂',
        'conference': '🎤',
        'default': '📅'
    };

    let emoji = eventEmojis.default;
    for (const [type, icon] of Object.entries(eventEmojis)) {
        if (eventName.toLowerCase().includes(type)) {
            emoji = icon;
            break;
        }
    }
    return emoji;
}

// Update the displayEvents function to include animation and emojis
function displayEvents() {
    eventsList.innerHTML = '';
    
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    events.forEach((event, index) => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const emoji = updateEventEmoji(event.name);
        
        eventCard.innerHTML = `
            <h3>${emoji} ${event.name}</h3>
            <div class="event-info">
                <i class="fas fa-calendar"></i>
                <span>${formattedDate}</span>
            </div>
            <div class="event-info">
                <i class="fas fa-clock"></i>
                <span>${event.time}</span>
            </div>
            <div class="event-info">
                <i class="fas fa-map-marker-alt"></i>
                <span>${event.location}</span>
            </div>
            <p>${event.description}</p>
            <button onclick="deleteEvent(${event.id})" class="delete-btn">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
        
        eventsList.appendChild(eventCard);
        
        // Add staggered animation
        setTimeout(() => {
            animateEventCreation(eventCard);
        }, index * 100);
    });
}

// Delete Event
function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        events = events.filter(event => event.id !== id);
        localStorage.setItem('events', JSON.stringify(events));
        displayEvents();
    }
}

// Add floating characters movement
document.addEventListener('mousemove', (e) => {
    const characters = document.querySelectorAll('.character');
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    characters.forEach(char => {
        const rect = char.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        const angleX = (mouseY - charY) / window.innerHeight * 10;
        const angleY = (mouseX - charX) / window.innerWidth * 10;

        char.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    });
});

// Initial display
displayEvents(); 