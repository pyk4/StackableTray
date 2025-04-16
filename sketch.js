
let client;
let pressureA = 0;
let pressureB = 0;
let threshold = 500;

function setup() {
  createCanvas(500, 300);
  setupMQTT();
}

function draw() {
  background(240);
  textSize(20);
  fill(0);
  text("MQTT connection running...", 50, 50);
  text("Tray A Pressure: " + pressureA, 50, 100);
  text("Tray B Pressure: " + pressureB, 50, 140);

  if (pressureA > threshold && pressureB < threshold) {
    text("Tray B should vibrate", 50, 200);
  } else if (pressureB > threshold && pressureA < threshold) {
    text("Tray A should vibrate", 50, 200);
  }
}

function setupMQTT() {
  console.log("Attempting MQTT connection...");

  client = mqtt.connect('wss://smallstallion123:1kqEdhgFXI1wdOzP@smallstallion123.cloud.shiftr.io', {
    clientId: 'p5js-client-' + Math.floor(Math.random() * 1000)
  });

  client.on('connect', () => {
    console.log('✅ Connected to shiftr.io');
    client.subscribe('trayA/pressure');
    client.subscribe('trayB/pressure');
  });

  client.on('error', (err) => {
    console.error("❌ MQTT connection error:", err);
  });

  client.on('reconnect', () => {
    console.log("🔁 Reconnecting...");
  });

  client.on('offline', () => {
    console.warn("📴 MQTT went offline.");
  });

  client.on('close', () => {
    console.warn("🔌 MQTT connection closed.");
  });

  client.on('message', (topic, message) => {
    console.log("📩 Message received:", topic, message.toString());
    if (topic === 'trayA/pressure') pressureA = int(message.toString());
    if (topic === 'trayB/pressure') pressureB = int(message.toString());
  });
}
