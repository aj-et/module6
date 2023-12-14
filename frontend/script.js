document.addEventListener('DOMContentLoaded', function() {
    let calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        initialView: 'dayGridMonth',
        headerToolbar: {
            start: 'title',
            center: 'dayGridMonth,timeGridDay',
            end: 'prev,next'
        },
        views: {
            timeGrid: {
                allDaySlot: false
            }
        },
        selectable: true,
        select: function(info) {
            showReservationForm(info);
        },
        selectAllow: function(selectInfo) {
            return selectInfo.start > new Date(); // Allow only future dates
        }
    });

    calendar.render();

    let calendarElement = document.getElementById('calendar');

    

    function showReservationForm(info) {
        // Populate form fields based on selected date/time (info.start)
        const selectedDate = info.start.toISOString().split('T')[0];
        const selectedTime = info.start.toISOString().split('T')[1].slice(0, 5);

        document.getElementById('date').value = selectedDate;
        document.getElementById('fromTime').value = selectedTime;

        // Show the reservation form
        document.getElementById('reservationForm').style.display = 'block';
    }

    async function fetchReservations() {
        try {

            // Show loading state
            document.getElementById('loading').style.display = 'block';

            // Disable the form
            document.getElementById('reservationForm').classList.add('disabled');

            const response = await fetch('https://reservation-app-rh0d.onrender.com/api/reservations');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            const events = data.map(reservation => ({
                title: `${reservation.name} (${reservation.fromTime} - ${reservation.untilTime})`,
                start: `${reservation.date}T${reservation.fromTime}`,
                end: `${reservation.date}T${reservation.untilTime}`
            }));

            calendar.removeAllEvents(); // Clear existing events
            calendar.addEventSource(events); // Add new events
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            // Hide loading state
            document.getElementById('loading').style.display = 'none';

            // Enable the form
            document.getElementById('reservationForm').classList.remove('disabled');
        }
    }

    fetchReservations();

    document.getElementById('reservationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addReservation();
    });

    async function addReservation() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const fromTime = document.getElementById('fromTime').value;
        const untilTime = document.getElementById('untilTime').value;
        const date = document.getElementById('date').value;

        const now = new Date();

        // Fetch existing reservations
        const existingReservations = await fetch('https://reservation-app-rh0d.onrender.com/api/reservations')
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching reservations:', error);
            });

        if (!existingReservations) {
            alert('An error occurred while fetching existing reservations. Please try again later.');
            return;
        }

        // Parse selected time as Date objects
        const datetimeStart = new Date(`${date}T${fromTime}`);
        const datetimeEnd = new Date(`${date}T${untilTime}`);

        // Check for conflicts with existing reservations
        const conflicts = existingReservations.some(reservation => {
            const existingStart = new Date(`${reservation.date}T${reservation.fromTime}`);
            const existingEnd = new Date(`${reservation.date}T${reservation.untilTime}`);

            return (datetimeStart < existingEnd && datetimeEnd > existingStart);
        });
        
        if (datetimeStart <= now) {
            alert('The date and time has already passed.');
            return;
        }

        if (conflicts) {
            alert('The selected time is already taken. Please choose a different time.');
            return;
        }

        // Continue with reservation logic...

        fetch('https://reservation-app-rh0d.onrender.com/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, fromTime, untilTime, date })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Reservation added successfully!');
            calendar.refetchEvents();
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('fromTime').value = '';
            document.getElementById('untilTime').value = '';
            document.getElementById('date').value = '';
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the reservation.');
        });
    }
});