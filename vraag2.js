async function sendAnswer() {
  const res = await fetch('https://public-lab.nl/api/vraag/2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ antwoord: 'programmeren' })
  });
  const data = await res.json();
  console.log(data);
}

sendAnswer();