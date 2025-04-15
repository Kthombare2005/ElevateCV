import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if it hasn't been initialized yet
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "elevatecv-42abf",
      clientEmail: "firebase-adminsdk-fbsvc@elevatecv-42abf.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQChkallVPPAK9ni\nRFSd9wsjJjSkwe5skrHbpj9s6X4Nc5ei3BAtEKcdfansidl9vcN1cDJOdDFChuQ4\n/fIH1Kc7ML/Zd87ljeahpxZoVJca6bx/1KVHhUixbh+vCF5Mpee3WqZyPbUEwT3F\nO/OtzqzDdRzxLWKx9UPJJtt+wP+TpnWYtgpnPzoDVL/TR7GzfuNmBij1D1Q8RrM1\nBXhC5nV2wXbs2L3v3WlHCNOcO8GGCLrK8Ud/Ytp6B39pnpegsd0wH4W/ytrLM34z\n/CbKxhZkS/bKU6BrtEhgPCSo7V0W/64X4lqr/NQaXke2VYghSWJFgD7D40tN9OwQ\n63fSBK2XAgMBAAECggEAQH/5AyYF5RrccbLboPBFtvOCop91Ak0RyeE1gtI360DR\nMUfvAT6bqG9JTc++Tq9Z/2EaBC3omGlnZMUkQTIIzN1qSXPF2ehrQO+GR4I1jJ3x\nDYsjrEiuO37+EQ8jLjAxMAZ1Wjf+Mva+JSYI4sMWPzVap4F53BdQx1XG3HRJ03RH\nEQFfcrBUcUXl8BEJF1aFFQBD+YS2LTVzKuMeNpAyXJjLs8KQSHLSY7NHXNXQgSQb\nE7jvNZUirwURvLyZ+Xa9aS9juaMzJBYMCpJf4mKCaMbez/vOyQ1zofEa7KgYkPhr\nqUlVJEwXF3eMi9gXk0JVC5enXkc45rwwsxQNNuRjkQKBgQDTKMFta2boskpkVgSY\npCT+4Eqa+6nrFSvCgqBgFjKSXEM1THcJ1+r1WUSViUSYLhtqOTdABJ7Bu7XI6dwM\njNxrma0hB6oJfoqmkTXwjQezHGq20HRqtgGdMwsarQvqT1jPvFkIXKWucxDaKZI1\nv4l4w6TO2smcIKG5Zrz7G0P0fwKBgQDD4QjGeIPzpAMnWK1M+Xnih+5KAFErQTv9\nWGa1O9X1ZLCbJu4TckeIik6l48qKGJqA9PHNpXGoMnAd3iGQ/yRFd/0akddJccB9\nsBPZklRck0xoSnkeCqq5+iMRTiaxevVnszVYFipeNEuZGSOwNHdp2vhrjpXGA+Us\nWddINYna6QKBgQDQHh4uyyl9daQuqj0TeMzhzIybnilGAvLDXl3U9mvXp0mycW/t\n6rqwINChFc7esqrgkg3rceJLDchIgn4YfIkPIELsCBLGEstzCjIAqe+J0Bs5ndDw\nD/0dQ97Q5veUc6oT7Q5PWIkPnGdirpBlmydSOHnqSudkkyDyi9j9IU1j3wKBgCdM\n1jLj6S2QAaX6T8L65u6BcVjdmWuBSiT5gJnqKHJ0wk5O0EOMkTee8EquWmu8pfsr\nqfwlrpkdjYsgj0GFP2TEvz5+dmBg90sAcescRdrRHuppzsUtRLXNrw2AzZicX/Jv\nbUuAHv4JpgVQmu12iWLusRr7X6d8DpYIbH4rZ75JAoGAWw+WXscjZTfHca70Gmbm\ntSvUtjqR3rBsnVDkr+9asEg7B6xpUdKJ51roSNHaMGjQEzJbbGxy7ilw8Omed6Yc\nWKMXIQj6BJoW6W50CruCDkKmXh3p+PFrlPGyE2WqEjSvQSKkyueTzasBypoRdmK+\noaRcSQbxZftlPimZovwsLrQ=\n-----END PRIVATE KEY-----\n"
    }),
    storageBucket: "elevatecv-42abf.appspot.com"
  });
}

export const db = getFirestore(); 