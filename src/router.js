import Vue from "vue";
import Router from "vue-router";
import localForage from "localforage";

const publicRoute = "./modules/public/";
const commonRoute = "./modules/common/";

const Public = () => import(`${publicRoute}Public.vue`);
const Common = () => import(`${commonRoute}Common.vue`);

const Login = () => import(`${publicRoute}login/Login.vue`);

const Welcome = () => import(`${commonRoute}welcome/Welcome.vue`);
const Photos = () => import(`${commonRoute}photos/Photos.vue`);
const UploadPhotos = () =>
  import(`${commonRoute}uploadPhotos/UploadPhotos.vue`);

Vue.use(Router);

let router = new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: {
        name: "Login"
      }
    },
    {
      path: "/Public",
      name: "Public",
      component: Public,
      redirect: {
        name: "Login"
      },
      children: [
        {
          path: "Login",
          name: "Login",
          component: Login,
          meta: {
            title: "Login"
          }
        }
      ]
    },
    {
      path: "/Common",
      name: "Common",
      component: Common,
      redirect: {
        name: "Welcome"
      },
      children: [
        {
          path: "Welcome",
          name: "Welcome",
          component: Welcome,
          meta: {
            title: "Welcome"
          }
        },
        {
          path: "Photos",
          name: "Photos",
          component: Photos,
          meta: {
            title: "Photos"
          }
        },
        {
          path: "UploadPhotos",
          name: "UploadPhotos",
          component: UploadPhotos,
          meta: {
            title: "UploadPhotos"
          }
        }
      ]
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   document.title = to["meta"]["title"];

//   if (to["name"]) {
//     if (!to["matched"].some(record => record["meta"]["public"])) {
//       localForage.getItem("token", (err, value) => {
//         if (!value) {
//           next({
//             name: "Login",
//             params: {
//               nextUrl: to["fullPath"],
//               errorCode: 0
//             }
//           });
//         } else {
//           next();
//         }
//       });
//     } else {
//       localForage.getItem("token", (err, value) => {
//         if (value) {
//           next({
//             name: from["name"]
//           });
//         } else {
//           next();
//         }
//       });
//     }
//   } else {
//     next({
//       name: "Login",
//       params: {}
//     });
//   }
// });

export default router;
