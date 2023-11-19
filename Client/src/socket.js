import io from 'socket.io-client';

const socket = io('http://your-server-address:5000'); // Đặt địa chỉ máy chủ của bạn ở đây

export default socket;
