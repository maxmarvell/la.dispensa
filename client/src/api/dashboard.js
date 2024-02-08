import axiosInstance from "./refresh";

export async function getDashboardRecipes({ take, lastCursor }) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get('/api/dashboard/recipes', {
          params: { take, lastCursor }
        });
        resolve(data)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    }, 1000)
  });
};


export async function getUserFeed({ take, username }) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get('/api/dashboard/users', {
          params: { take, username }
        });
        resolve(data)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    }, 1000)
  });
}


export async function getNotificationFeed({ take, lastCursor }) {

}


