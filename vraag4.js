async function sendAnswer() {
  const res = await fetch('https://public-lab.nl/api/vraag/4', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ antwoord: 14})
  });
  const data = await res.json();
  console.log(data);
}

sendAnswer();