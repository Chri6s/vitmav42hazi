<h1>VITMAV42 Házi</h1>
<h2>author: Hozák Krisztián Attila</h2>

## Könyv Kölcsönző Rendszer Specifikáció

Készítette: Hozák Krisztián Attila (F3D10S)

### 1\. Rendszer Áttekintése

A rendszer célja, hogy lehetőséget biztosítson a felhasználók számára, hogy regisztráljanak, böngésszenek a könyvek között, kölcsönözzenek könyveket, valamint visszaadják őket. Emellett egy adminisztrációs felületet is biztosít, ahol az adminok kezelhetik a könyvtárkészletet (új könyvek hozzáadása, meglévők módosítása, törlése).

### 2\. Entitások és Adatmodellek

#### 2.1. Felhasználó (User)

- **Attribútumok:**
  - id: Egyedi azonosító.
  - username: Teljes név.
  - email: Egyedi email cím.
  - password: Titkosított jelszó.
  - role: Felhasználó típusa (például "felhasználó" vagy "admin").

#### 2.2. Könyv (Book)

- **Attribútumok:**
  - id: Egyedi azonosító.
  - Name: A könyv címe.
  - szerző: A könyv szerzője.
  - ISBN: Nemzetközi szabványos könyvazonosító.
  - category: Például "szépirodalom", "tudományos", stb.
  - status: A könyv elérhetősége (pl. "elérhető", "kölcsönben").
  - (Opcionális): Rövid leírás, kiadás éve, borító kép URL-je.

#### 2.3. Kölcsönzés (Loan)

- **Attribútumok:**
  - id: Egyedi azonosító.
  - userId: Hivatkozás a kölcsönző felhasználóra.
  - bookId: Hivatkozás a kölcsönzött könyvre.
  - borrowedDate: A kölcsönzés kezdete.
  - returnDate: A könyv visszaadásának ideje (ha még nincs visszaadva, ez lehet null vagy üres).
  - status: Például "aktív" (kölcsönzés folyamatban) vagy "lezárt" (visszaadva).

### 3\. Funkcionális Követelmények

#### 3.1. Felhasználói Funkciók

- **Regisztráció és Bejelentkezés:**
  - Felhasználók létrehozhatnak fiókot, majd bejelentkezhetnek.
  - Hitelesítés tokenekkel (pl. JWT) vagy session alapú megoldással.
- **Könyvek Böngészése és Keresése:**
  - A főoldalon a könyvek listája jelenik meg, ahol a felhasználók cím, szerző, kategória szerint szűrhetnek.
  - Egy keresőmező segíti a gyors találatokat.
- **Kölcsönzés:**
  - A felhasználók a könyv részleteinek megtekintése után, ha a könyv elérhető, kölcsönözhetik azt.
  - A kölcsönzés során a rendszer létrehoz egy Loan rekordot, és frissíti a könyv állapotát "kölcsönben"-re.
- **Könyv Visszaadás:**
  - A felhasználók megtekinthetik a saját aktív kölcsönzéseiket.
  - Egy visszaadás gomb segítségével lezárhatják a kölcsönzést, frissítve a Loan rekordot és a könyv állapotát "elérhető"-re.

#### 3.2. Admin Funkciók

- **Könyvek Kezelése (CRUD):**
  - Új könyvek hozzáadása.
  - Meglévő könyvek adatainak módosítása.
  - Könyvek törlése a rendszerből.

### 4\. Nézetek (UI)

#### A. Bejelentkezés / Regisztráció Oldal

- **Elemei:**
  - Regisztrációs űrlap (név, email, jelszó)
  - Bejelentkezési űrlap

#### B. Könyvtári Katalógus Nézet

- **Elemei:**
  - Könyvek listája.
  - Keresőmező, szűrési lehetőségek (cím, szerző, kategória).
  - Könyv részletek megtekintése érdekében kattintható elemek.

#### C. Kölcsönzési és Profil Nézet

- **Elemei:**
  - A felhasználó aktív és korábbi kölcsönzéseinek listája.
  - Gomb a könyv visszaadásához, ha a kölcsönzés még aktív.
  - (Admin felületen) Könyv kezelési funkciók (szerkesztés, törlés, új könyv hozzáadása).

### 5\. Backend Megvalósítás Express.js-sel

Az Express.js segítségével RESTful API-t használunk a következő végpontokkal:

- **Felhasználók:**
  - POST /api/register: Új felhasználó regisztrálása.
  - POST /api/login: Felhasználó bejelentkezése, token kiadása.
- **Könyvek:**
  - GET /api/books: Az összes könyv lekérdezése.
  - GET /api/books/:id: Egy adott könyv részleteinek lekérdezése.
  - POST /api/books: Új könyv hozzáadása (admin).
  - PUT /api/books/:id: Könyv adatainak módosítása (admin).
  - DELETE /api/books/:id: Könyv törlése (admin).
- **Kölcsönzések:**
  - POST /api/loans: Könyv kölcsönzésének elindítása.
  - PUT /api/loans/:id/return: Könyv visszaadásának rögzítése.

### 6\. Adatbázis Tervezés

NoSQL, MongoDB-t fog használni a program. A MongoDB nem kifejezetten hatalmas adathalmazokra van tervezve, adott adatmennyiség után és komplexebb kapcsolatoknál elkezd eszméletlenül sok erőforrást fogyasztani és egy ponton átfordul és nem lesz a gazdaságos fenttartani. De tökéletes kisebb projektekhez, mint a mi könyvkölcsönzőnk.

**Collections:**

- **users:**
  - \_id: Automatikusan generált egyedi azonosító.
  - name: Felhasználó teljes neve.
  - email: Egyedi email cím.
  - password: Titkosított jelszó (pl. sha128).
  - role: "user" vagy "admin" lehet.
  - createdAt: A regisztráció időpontja.
- **books:**
  - \_id: Automatikusan generált egyedi azonosító.
  - title: A könyv címe.
  - author: Szerző neve.
  - isbn: Nemzetközi szabványos könyvazonosító.
  - category: Könyv kategóriája (pl. "Sci-Fi", "Történelem").
  - description: Rövid összegzés a könyvről.
  - coverImage: URL egy képhez, amely a borítót ábrázolja.
  - status: "available" (elérhető) vagy "borrowed" (kölcsönben van).
  - createdAt: A könyv hozzáadásának dátuma.
- **loans:**
  - \_id: Egyedi azonosító.
  - userId: A kölcsönző felhasználó \_id-ja (users gyűjteményből).
  - bookId: A kölcsönzött könyv \_id-ja (books gyűjteményből).
  - borrowedAt: A kölcsönzés időpontja.
  - dueDate: Határidő, ameddig vissza kell vinni a könyvet.
  - returnedAt: Ha a könyvet visszahozták, itt lesz az időpontja (egyébként null).
  - status: "active" (kölcsönben van) vagy "completed" (visszaadták).

### 7\. Működési Workflow

1. **Felhasználó regisztrál és bejelentkezik.**
2. **A főoldalon a könyvtári katalógusban böngészik a könyvek között.**
3. **A felhasználó egy könyv részleteit megtekintve, ha az elérhető, rákattint a "Kölcsönzés" gombra.**
    - A rendszer létrehoz egy aktív Loan rekordot, és frissíti a könyv állapotát.
4. **A felhasználó később a profiljában megtekintheti a kölcsönzéseit, és ha kész a könyv visszaadásával, kattinthat a "Visszaadás" gombra.**
    - A rendszer lezárja a loan-t, rögzíti a visszaadás dátumát, és visszaállítja a könyv állapotát "elérhető"-re.
5. **Adminok belépése esetén:**
    - A rendszer admin felületen keresztül lehetővé teszi a könyvek hozzáadását, módosítását és törlését, valamint statisztikák megtekintését a kölcsönzési adatok alapján.
