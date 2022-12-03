interface IProfileFB {
  _json: IUser;
}
interface IUser {
  id: string;
  name: string;
  picture: {
    data: {
      height: number;
      is_silhouetter: boolean;
      url: string;
      width: number;
    };
  };
}

interface IProfileGoogle {
  id: string;
  displayName: string;
  name: Name;
  photos: Photo[];
  provider: string;
}

interface Name {
  familyName: string;
  givenName: string;
}

interface Photo {
  value: string;
}
