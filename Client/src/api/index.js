import axios from "axios";

// Thay thế URL dưới đây bằng URL của API điều khiển đèn của bạn
const apiUrl = "http://localhost:5000";

// Function để điều khiển đèn
const controlLed = async (ledId, state) => {
  try {
    const response = await axios.post(apiUrl + "/control/led/" + ledId, { state });

    if (response.status === 200 && response.data.success) {
      console.log(response.data.message);
    } else {
      console.error(response.data.message);
    }
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu điều khiển đèn:", error);
  }
};

export { controlLed };
