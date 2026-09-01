async function sendAnswer() {
  const res = await fetch('https://public-lab.nl/api/vraag/1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ antwoord: 842 })
  });
  const data = await res.json();
  console.log(data);
}

sendAnswer();