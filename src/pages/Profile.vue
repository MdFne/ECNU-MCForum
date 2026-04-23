<template>
  <div class="bg-content">
    <div class="bg-image"></div>
    <div class="profile">
      <div class="profile-card">
        <!-- 头像部分 -->
        <div class="avatar-section">
          <div class="avatar-container">
            <!-- 头像显示 -->
            <img 
              :src="user.avatar || defaultAvatar" 
              alt="用户头像" 
              class="avatar"
            />
            <!-- 头像上传按钮 -->
            <button class="avatar-upload-btn" @click="triggerFileInput">
              <span>+</span>
            </button>
            <!-- 头像上传输入框 -->
            <input 
              type="file" 
              ref="fileInput" 
              style="display: none" 
              accept="image/*" 
              @change="handleAvatarUpload"
            />
            <!-- 问候语部分 -->
            <div class="greeting">
              <span class="greeting-text">
                <img :src="clockImage" alt="时钟贴图" class="clock-image">
                {{ greeting }}，{{ user.username }}
              </span>
              <span class="time">现在是 {{ currentTime }}，距离您上次登录已经过去了 {{ loginInterval }}</span>
            </div>
          </div>
        </div>

        <!-- 用户信息部分 -->
        <div class="user-info">
          <div class="info-item">
            <span class="label">用户名</span>
            <div class="value-with-btn">
              <span class="value">{{ user.username }}</span>
              <button class="edit-btn" @click="editUsername = true">修改</button>
            </div>
          </div>
          <div class="info-item">
            <span class="label">用户ID</span>
            <span class="value">{{ user.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">学校</span>
            <div class="value-with-btn">
              <span class="value">{{ user.school || '未设置' }}</span>
              <button class="edit-btn" @click="editSchool = true">修改</button>
            </div>
          </div>
          <div class="info-item">
            <span class="label">年龄</span>
            <div class="value-with-btn">
              <span class="value">{{ user.age || '未设置' }}</span>
              <button class="edit-btn" @click="editAge = true">修改</button>
            </div>
          </div>
          <div class="info-item">
            <span class="label">注册时间</span>
            <span class="value">{{ user.registerDate || '未知' }}</span>
          </div>
        </div>

        <!-- 操作按钮部分 -->
        <div class="action-buttons">
          <button class="change-password" @click="changePassword">修改密码</button>
          <button class="logout" @click="logout">退出登录</button>
        </div>
      </div>

      <!-- 修改用户名弹窗 -->
      <div v-if="editUsername" class="modal">
        <div class="modal-content">
          <h3>修改用户名</h3>
          <input type="text" v-model="newUsername" placeholder="输入新用户名" />
          <div class="modal-buttons">
            <button @click="editUsername = false">取消</button>
            <button @click="saveUsername">保存</button>
          </div>
        </div>
      </div>

      <!-- 修改学校弹窗 -->
      <div v-if="editSchool" class="modal">
        <div class="modal-content">
          <h3>修改学校</h3>
          <input type="text" v-model="newSchool" placeholder="输入学校名称" />
          <div class="modal-buttons">
            <button @click="editSchool = false">取消</button>
            <button @click="saveSchool">保存</button>
          </div>
        </div>
      </div>

      <!-- 修改年龄弹窗 -->
      <div v-if="editAge" class="modal">
        <div class="modal-content">
          <h3>修改年龄</h3>
          <input type="number" v-model="newAge" placeholder="输入年龄" />
          <div class="modal-buttons">
            <button @click="editAge = false">取消</button>
            <button @click="saveAge">保存</button>
          </div>
        </div>
      </div>

      <!-- 修改密码弹窗 -->
      <div v-if="showChangePassword" class="modal">
        <div class="modal-content">
          <h3>修改密码</h3>
          <input type="password" v-model="oldPassword" placeholder="输入旧密码" />
          <input type="password" v-model="newPasswordInput" placeholder="输入新密码" />
          <input type="password" v-model="confirmPassword" placeholder="确认新密码" />
          <div class="modal-buttons">
            <button @click="showChangePassword = false">取消</button>
            <button @click="savePassword">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';
import { useUserStore } from '../stores/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const fileInput = ref(null);

// 问候语
const greeting = ref('你好');
const currentTime = ref(null);
const loginInterval = ref('');

// 时钟贴图文件
const clockImage = ref(
  new URL(`../assets/clock/1.png`, import.meta.url).href
);

// 后端服务器地址（用于拼接头像等静态资源路径）
const API_BASE = 'http://localhost:3000';

// 从 userStore 获取用户数据（计算属性，保持响应式）
const user = computed(() => ({
  id: userStore.userId,
  username: userStore.username,
  avatar: userStore.avatar ? API_BASE + userStore.avatar : '',
  school: userStore.school,
  age: userStore.age,
  email: userStore.email,
  registerDate: userStore.createdAt ? new Date(userStore.createdAt).toLocaleDateString() : '未知'
}));

const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar%20simple%20design&image_size=square';

// 编辑状态
const editUsername = ref(false);
const editSchool = ref(false);
const editAge = ref(false);
const showChangePassword = ref(false);

// 保存loading状态
const savingUsername = ref(false);
const savingSchool = ref(false);
const savingAge = ref(false);
const savingPassword = ref(false);

// 表单数据
const newUsername = ref('');
const newSchool = ref('');
const newAge = ref('');
const oldPassword = ref('');
const newPasswordInput = ref('');
const confirmPassword = ref('');

// 获取当前时间并决定问候语
const setGreeting = () => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();

  if (hour >= 5 && hour < 10) {
    greeting.value = '早上好';
  } else if (hour >= 10 && hour < 14) {
    greeting.value = '中午好';
  } else if (hour >= 14 && hour < 18) {
    greeting.value = '下午好';
  } else if (hour >= 18 && hour < 22) {
    greeting.value = '晚上好';
  } else {
    greeting.value = '夜深了 注意休息哦';
  }

  // 根据hours映射时钟贴图
  let i = Math.floor((hour * 60 + minute) / 1440 * 64) + 1 + 32;
  console.log(i);
  clockImage.value = new URL(`../assets/clock/${i % 64}.png`, import.meta.url).href;
}

// 更新当前时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleString();
}

// 获取登录间隔
const updateLoginInterval = () => {
  if (userStore.lastLoginAt) {
    let lastTime = new Date(userStore.lastLoginAt).getTime();
    let now = new Date().getTime();
    let interval = now - lastTime;
    loginInterval.value = formatTimestamp(interval);
  } else {
    loginInterval.value = '未知';
  }
}

// 格式化时间戳
function formatTimestamp(ts) {
 const second = 1000
  const minute = second * 60
  const hour = minute * 60
  const day = hour * 24

  const days = Math.floor(ts / day)
  const hours = Math.floor((ts % day) / hour)
  const minutes = Math.floor((ts % hour) / minute)

  let str = ''
  if (days > 0) str += `${days}天`
  if (hours > 0) str += `${hours}时`
  if (minutes > 0) str += `${minutes}分`

  // console.log(str);
  return str || '1分'
}

// 触发文件输入
const triggerFileInput = () => {
  fileInput.value.click();
};

// 处理头像上传
const uploadingAvatar = ref(false);

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 前端校验文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    ElMessage.warning('只支持 JPG、PNG、GIF、WebP 格式的图片');
    return;
  }

  // 前端校验文件大小（2MB）
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过 2MB');
    return;
  }

  uploadingAvatar.value = true;
  try {
    await userStore.uploadAvatar(file);
    ElMessage.success('头像上传成功');
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '头像上传失败');
  } finally {
    uploadingAvatar.value = false;
    // 清空 input 以便重复选择同一文件
    event.target.value = '';
  }
};

// 保存用户名
const saveUsername = async () => {
  if (!newUsername.value || !newUsername.value.trim()) {
    ElMessage.warning('用户名不能为空');
    return;
  }
  savingUsername.value = true;
  try {
    await userStore.updateProfile({ username: newUsername.value.trim() });
    ElMessage.success('用户名修改成功');
    editUsername.value = false;
    newUsername.value = '';
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '修改失败');
  } finally {
    savingUsername.value = false;
  }
};

// 保存学校
const saveSchool = async () => {
  if (!newSchool.value || !newSchool.value.trim()) {
    ElMessage.warning('学校不能为空');
    return;
  }
  savingSchool.value = true;
  try {
    await userStore.updateProfile({ school: newSchool.value.trim() });
    ElMessage.success('学校修改成功');
    editSchool.value = false;
    newSchool.value = '';
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '修改失败');
  } finally {
    savingSchool.value = false;
  }
};

// 保存年龄
const saveAge = async () => {
  if (!newAge.value) {
    ElMessage.warning('年龄不能为空');
    return;
  }
  savingAge.value = true;
  try {
    await userStore.updateProfile({ age: parseInt(newAge.value) });
    ElMessage.success('年龄修改成功');
    editAge.value = false;
    newAge.value = '';
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '修改失败');
  } finally {
    savingAge.value = false;
  }
};

// 打开修改密码弹窗
const changePassword = () => {
  showChangePassword.value = true;
};

// 保存密码
const savePassword = async () => {
  if (!oldPassword.value || !newPasswordInput.value || !confirmPassword.value) {
    ElMessage.warning('请填写所有密码字段');
    return;
  }
  if (newPasswordInput.value !== confirmPassword.value) {
    ElMessage.warning('两次输入的新密码不一致');
    return;
  }
  if (newPasswordInput.value.length < 6) {
    ElMessage.warning('新密码长度至少6位');
    return;
  }
  savingPassword.value = true;
  try {
    await userStore.changePassword({
      oldPassword: oldPassword.value,
      newPassword: newPasswordInput.value
    });
    ElMessage.success('密码修改成功');
    showChangePassword.value = false;
    oldPassword.value = '';
    newPasswordInput.value = '';
    confirmPassword.value = '';
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '密码修改失败');
  } finally {
    savingPassword.value = false;
  }
};

// 退出登录
const logout = async () => {
  try {
    await userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
};

// 视差滚动
const parallaxScroll = () => {
  const scrollTop = window.scrollY
  const bg = document.querySelector('.bg-image')

  // 慢速移动：scrollY * 0.3
  bg.style.transform = `translateY(${scrollTop * -0.3}px)`
}

// 定时器
let clockTimer = null;

// 页面加载时设置问候语
onMounted(async () => {
  setGreeting();
  updateTime();
  // 如果 userStore 中没有详细信息，从服务器拉取
  if (userStore.isLoggedIn && !userStore.school) {
    await userStore.fetchProfile();
  }
  updateLoginInterval();
  window.addEventListener('scroll', parallaxScroll);

  clockTimer = setInterval(() => {
    updateTime();
  }, 1000);
});

// 页面卸载时清除定时器
onUnmounted(() => {
  clearInterval(clockTimer);
  window.removeEventListener('scroll', parallaxScroll);
});


</script>

<style scoped>
  /* Profile page styles */
  .profile {
    width: min(80%, 900px);
    margin: 0 auto;
    padding: 0;
    font-family: Arial, sans-serif;
  }

  .profile h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--color-text);
  }

  .profile-card {
    background: var(--color-bg-white);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    padding: 2rem;
  }

  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
  }

  .avatar-container {
    position: relative;
    margin-bottom: 1rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 85%;
  }

  .avatar-container .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #e0e0e0;
  }

  .avatar-upload-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    background: var(--color-success);
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .avatar-upload-btn:hover {
    background: #45a049;
  }

  .greeting {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.8rem;
    width: 70%;
    line-height: 1.1;
  }

  .greeting .clock-image {
    width: 2.5rem;
    height: auto;
    display: inline;
    margin-bottom: -0.3rem;
  }

  .greeting .greeting-text {
    margin-top: 0.8rem;
    text-align: left;
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .greeting .time {
    text-align: left;
    font-size: 1.2rem;
    color: var(--color-text-secondary);
  }

  .user-info {
    margin-bottom: 2rem;
  }

  .user-info .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .user-info .info-item:last-child {
    border-bottom: none;
  }

  .user-info .info-item .label {
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  .user-info .info-item .value {
    color: var(--color-text);
  }

  .user-info .info-item .edit-btn {
    background: #f0f0f0;
    border: none;
    border-radius: var(--radius-sm);
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .user-info .info-item .edit-btn:hover {
    background: #e0e0e0;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .action-buttons button {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 1rem;
  }

  .action-buttons button.change-password {
    background: var(--color-info);
    color: white;
  }

  .action-buttons button.change-password:hover {
    background: #0b7dda;
  }

  .action-buttons button.logout {
    background: var(--color-danger);
    color: white;
  }

  .action-buttons button.logout:hover {
    background: #da190b;
  }

  .bg-image {
    background: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
          url('../assets/ECNUSakura/4.png') center/cover no-repeat;
  }

  /* 弹窗样式 */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: var(--radius-md);
    width: 90%;
    max-width: 400px;
  }

  .modal-content h3 {
    margin-bottom: 1rem;
    text-align: center;
  }

  .modal-content input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: var(--radius-sm);
  }

  .modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .modal-buttons button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  .modal-buttons button:first-child {
    background: #f0f0f0;
  }

  .modal-buttons button:first-child:hover {
    background: #e0e0e0;
  }

  .modal-buttons button:last-child {
    background: var(--color-success);
    color: white;
  }

  .modal-buttons button:last-child:hover {
    background: #45a049;
  }

  /* 用户名等带按钮的样式 */
  .value-with-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .profile {
      padding: 1rem;
    }

    .profile-card {
      padding: 1.5rem;
    }

    .avatar-container {
      width: 90%;
      flex-direction: column;
      align-items: center;
      margin-bottom: 0;
      gap: 1rem;
    }

    .greeting {
      width: 100%;
    }

    .greeting .greeting-text {
      font-size: 2rem;
    }

    .greeting .time {
      font-size: 1rem;
    }

    .avatar-container .avatar {
      width: 100px;
      height: 100px;
      order: 1;
    }

    .avatar-upload-btn {
      left: 25%;
    }

    .action-buttons {
      flex-direction: column;
    }

    .action-buttons button {
      width: 100%;
    }
  }
</style>