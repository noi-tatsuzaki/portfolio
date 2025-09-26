---
title: "Boat Race Project (Stevens Institute of Technology ENGR 122)"
date: 2025-01-01
tags: [embedded-systems, robotics, control-systems]
url: ""
cover: "/assets/works/boat-race-project.png"
summary: "Autonomous small robot boat design and construction project focusing on wiring reliability and IMU-based PID control."
---

In a project to design and construct an autonomous small robot boat, I was primarily responsible for wiring. To stabilize circuits on breadboards, I adopted preformed jumper wires, which improved wiring visibility and connection stability compared to traditional flexible wires. This significantly reduced malfunctions and troubles caused by wiring disturbances, greatly improving debugging and repair efficiency. I also implemented safe and stable circuits while addressing various issues during experiments, including shorts from overcurrent and component failures.

## 【Technical Information】

**Microcontroller:** ESP32 Board
**Communication:** MQTT Protocol (wireless communication)
**Programming Language:** Arduino C
**Sensors:** IMU Sensor (accelerometer/gyroscope), OLED Display
**Control Algorithm:** PID control for directional control
**Circuit Configuration:** Breadboard wiring

### Main Functions:
- Autonomous navigation (direction detection and movement commands via IMU)
- Real-time angle display via OLED
- External network connection via MQTT

---

## 【技術情報】

**使用マイコン：** ESP32 Board
**通信方法：** MQTTプロトコル (無線通信)
**プログラミング言語：** Arduino C
**センサ類：** IMUセンサ (加速度・ジャイロ), OLEDディスプレイ
**制御アルゴリズム：** PID制御による方向制御
**回路構成：** ブレッドボード配線

### 主な機能：
- 自立航行 (IMUによる方向検出と移動命令)
- OLEDによるリアルタイム角度表示
- MQTTを介した外部ネットワーク接続
