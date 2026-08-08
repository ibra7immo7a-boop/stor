import { mockUsers } from "@/data/mockData";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

const userStore = clone(mockUsers);

export function resetMockUsers() {
  const fresh = clone(mockUsers);
  userStore.splice(0, userStore.length, ...fresh);
  return clone(userStore);
}

export async function getEmployeeListApi() {
  await delay(300);
  return {
    success: true,
    users: clone(userStore),
  };
}

export async function loginApi(username, password) {
  await delay(500);

  const normalizedUsername = String(username || "").trim();
  const normalizedPassword = String(password || "").trim();

  const user = userStore.find(
    (item) => item.username === normalizedUsername && item.password === normalizedPassword
  );

  if (!user) {
    return {
      success: false,
      message: "اسم المستخدم أو كلمة المرور غير صحيحة.",
    };
  }

  if (!user.active) {
    return {
      success: false,
      message: "هذا الحساب غير نشط حالياً، يرجى التواصل مع المدير.",
    };
  }

  const safeUser = { ...user };
  delete safeUser.password;

  return {
    success: true,
    user: safeUser,
    message: "تم تسجيل الدخول بنجاح.",
  };
}

export async function updateEmployeePermissions(employeeId, newPermissions) {
  await delay(500);

  const index = userStore.findIndex((employee) => employee.id === employeeId);

  if (index === -1) {
    return {
      success: false,
      message: "لم يتم العثور على الموظف المطلوب.",
    };
  }

  userStore[index] = {
    ...userStore[index],
    permissions: clone(newPermissions),
  };

  const safeEmployee = { ...userStore[index] };
  delete safeEmployee.password;

  return {
    success: true,
    employee: safeEmployee,
    message: "تم تحديث صلاحيات الموظف بنجاح.",
  };
}
