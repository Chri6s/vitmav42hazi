# BookJam: Könyv Kölcsönző Rendszer Specifikáció
![CodeQL](https://github.com/Chri6s/vitmav42hazi/actions/workflows/main.yml/badge.svg)

**Készítette:** Hozák Krisztián Attila (F3D10S)

## 1. Rendszer Áttekintése
A rendszer célja, hogy lehetőséget biztosítson a felhasználók számára, hogy regisztráljanak, böngésszenek a könyvek között, kölcsönözzenek könyveket, valamint visszaadják őket. Emellett egy adminisztrációs felületet is biztosít, ahol az adminok kezelhetik a könyvtárkészletet (új könyvek hozzáadása, meglévők módosítása, törlése). Egy könyvet 3 hónapra (nem változtatható) időtartamra van kiadva, 3 hónapon belül vissza kell a felhasználónak hoznia.  

## 2. Entitások és Adatmodellek

### 2.1. Felhasználó (User)
- **Attribútumok:**
  - `id`: Egyedi azonosító.
  - `username`: Felhasználónév.
  - `email`: Egyedi email cím.
  - `gravatarEmail`: Email cím a profil képhez.
  - `password`: Titkosított jelszó.
  - `type`: Felhasználó típusa (pl. "user" vagy "admin").

### 2.2. Könyv (Book)
- **Attribútumok:**
  - `id`: Egyedi azonosító.
  - `title`: A könyv címe.
  - `author`: A könyv szerzője.
  - `ISBN`: Nemzetközi szabványos könyvazonosító.
  - `category`: Például "szépirodalom", "tudományos", stb.
  - `status`: A könyv elérhetősége (pl. "elérhető", "kölcsönben").

### 2.3. Kölcsönzés (Loan)
- **Attribútumok:**
  - `id`: Egyedi azonosító.
  - `userId`: Hivatkozás a kölcsönző felhasználóra.
  - `bookId`: Hivatkozás a kölcsönzött könyvre.
  - `borrowedDate`: A kölcsönzés kezdete.
  - `returnDate`: A könyv visszaadásának ideje (ha még nincs visszaadva, ez lehet `null` vagy üres).
  - `status`: Például "active" (kölcsönzés folyamatban) vagy "returned" (visszaadva).

## 3. Funkciók

### 3.1. Felhasználói Funkciók

#### Regisztráció és Bejelentkezés
- Felhasználók létrehozhatnak fiókot, majd bejelentkezhetnek.
- Hitelesítés session tokenekkel.

#### Könyvek Böngészése és Keresése
- A főoldalon a könyvek listája jelenik meg, ahol a felhasználók cím, szerző, kategória szerint szűrhetnek.
- Egy keresőmező segíti a gyors találatokat.

#### Kölcsönzés
- A felhasználók a könyv részleteinek megtekintése után, ha a könyv elérhető, kölcsönözhetik azt.
- A kölcsönzés során a rendszer létrehoz egy `Loan` rekordot, és frissíti a könyv állapotát "borrowed"-ra.

#### Könyv Visszaadás
- A felhasználók megtekinthetik a saját aktív kölcsönzéseiket.
- Egy visszaadás gomb segítségével lezárhatják a kölcsönzést, frissítve a `Loan` rekordot és a könyv állapotát "elérhető"-re.

### 3.2. Admin Funkciók
- Könyvek kezelése (CRUD):
  - Új könyvek hozzáadása.
  - Meglévő könyvek adatainak módosítása.
  - Könyvek törlése a rendszerből.

## 4. Működési Workflow
1. Felhasználó regisztrál és bejelentkezik.
2. A főoldalon a könyvtári katalógusban böngészik a könyvek között.
3. A felhasználó egy könyv részleteit megtekintve, ha az elérhető, rákattint a "Kölcsönzés" gombra.
   - A rendszer létrehoz egy aktív `Loan` rekordot, és frissíti a könyv állapotát.
4. A felhasználó később a profiljában megtekintheti a kölcsönzéseit, és ha kész a könyv visszaadásával, kattinthat a "Visszaadás" gombra.
   - A rendszer lezárja a `Loan`-t, rögzíti a visszaadás dátumát, és visszaállítja a könyv állapotát "elérhető"-re.
5. Adminok belépése esetén:
   - A rendszer admin felületen keresztül lehetővé teszi a könyvek hozzáadását, módosítását és törlését, valamint statisztikák megtekintését a kölcsönzési adatok alapján.

## 5. Nézetek (UI)

### A. Főoldal
- **Elemei:**
  - "Main Content", elérhető újonnan megjelent könyvek.
  - **Header:** bejelentkezés, regisztrációs gombok.

### B. Bejelentkezés / Regisztráció Oldal
- **Elemei:**
  - Regisztrációs űrlap (felhasználónév, email, jelszó, jelszó újra).
  - Bejelentkezési űrlap (felhasználónév, jelszó).

### C. Könyvtári Katalógus Nézet
- **Elemei:**
  - Könyvek listája.
  - Keresőmező, szűrési lehetőségek (cím, szerző, kiadási év).
  - Könyv részletek megtekintése érdekében kattintható elemek.

### D. Kölcsönzési és Profil Nézet
- **Elemei:**
  - A felhasználó aktív és korábbi kölcsönzéseinek listája.
  - Gomb a könyv visszaadásához, ha a kölcsönzés még aktív.
  - (Admin felületen) Könyv kezelési funkciók (szerkesztés, törlés, új könyv hozzáadása).

## 6. Adatbázis Tervezés
A program NoSQL alapú, MongoDB-t használ.

### Collections
#### users
- `_id`: Automatikusan generált egyedi azonosító.
- `name`: Felhasználó teljes neve.
- `email`: Egyedi email cím.
- `gravatarEmail`: Gravatar email cím.
- `password`: Titkosított jelszó.
- `type`: "user" vagy "admin" lehet.
- `createdAt`: A regisztráció időpontja.

#### books
- `_id`, `addedDate`, `title`, `author`, `isbn`, `category`, `status`, `previewPath`, `createdAt`.

#### loans
- `_id`, `userId`, `bookId`, `borrowedAt`, `returnedAt`, `status`.

