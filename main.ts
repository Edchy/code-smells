/**
 * 1. Onödig variabel och onödig return av variabel. reduce ger tillbaks en ny array så det går att returnera direkt.
 * Andra argumentet till reduce är initiala värdet för "ackumulator variabeln".
 * Sätts till 0 här men behövs egentligen inte då elementet på index 0 används om man inte anger ett andra argument.
 */
// smelly
// function getLength(jumpings: number[]): number {
//   let totalNumber = 0;

//   totalNumber = jumpings.reduce(
//     (jumpDistanceSoFar, currentJump) => jumpDistanceSoFar + currentJump
//   );

//   return totalNumber;
// }

// bättre
function getLength2(jumpings: number[]): number {
  return jumpings.reduce(
    (jumpDistanceSoFar, currentJump) => jumpDistanceSoFar + currentJump,
    0
  );
}

/*2.Ok, så det första jag tänker här är ju att man måste heta Sebastian för att bli godkänd :). 
Och att detta inte är någon "pure function" då den tar in ett objekt och ändrar det. Men detta har ju inte direkt med refaktorering att göra. 
Fast kanske det har ändå pga namnet getStudentStatus - detta indikerar ju att funktionen är en "get-funktion", men det blir här även en "set-funktion". 
Så den failar på ett sätt "Single-resp" i "SOLID"
Andra jag tänker är att ternary är nice, men nestlade ternaries inte är nice. Blir såklart mer kompakt men svårt att läsa.*/

class Student {
  constructor(
    public name: string,
    public handedInOnTime: boolean,
    public passed: boolean
  ) {}
}

// smelly
// function getStudentStatus(student: Student): string {
//   student.passed =
//     student.name == "Sebastian"
//       ? student.handedInOnTime
//         ? true
//         : false
//       : false;

//   if (student.passed) {
//     return "VG";
//   } else {
//     return "IG";
//   }
// }

//bättre (dock inte samma som första om man även vill modifiera student.passed)
function getStudentStatus2(student: Student): string {
  return student.name === "Sebastian" && student.handedInOnTime ? "VG" : "IG";
}

/*3. Fan jag har suttit med den här allt för länge och testat olika sett att göra det på. 
Men den uppenbara "smellen" här är ju variabelnamnen som är väldigt otydliga. 
Det var svårt att komma på bra namn så min lösning är halvkass oxå men det blir iaf lite tydligare. 
Sen undrar jag varför returnen är hårdkodad till / 7. Här bör man väl dela med antalet resultat, typ. Eller så tänker jag fel. */

// smelly
// const temperatures: Temp[] = [new Temp("London", new Date(), 15)];

// function averageWeeklyTemperature(heights: Temp[]) {
//   let r = 0;

//   for (let who = 0; who < heights.length; who++) {
//     if (heights[who].q === "Stockholm") {
//       if (heights[who].where.getTime() > Date.now() - 604800000) {
//         r += heights[who].v;
//       }
//     }
//   }

//   return r / 7;
// }

// bättre - Alternativ 1.
// Här har jag inte försökt att göra koden så kompakt som möjligt utan snarare mer lättläslig. Därav fler variabler.
class CityTemp {
  constructor(public city: string, public date: Date, public temp: number) {}
}

const cityTemperatures: CityTemp[] = [
  new CityTemp("London", new Date(), 15),
  new CityTemp("London", new Date(), 25),
  new CityTemp("London", new Date(), 8),
  new CityTemp("London", new Date(Date.now() - 1004800000), 20),
  new CityTemp("Stockholm", new Date(), 10),
  new CityTemp("Malmö", new Date(), 13),
  new CityTemp("Stockholm", new Date(Date.now() - 172800000), 12),
  new CityTemp("Stockholm", new Date(Date.now() - 604800000), 14),
  new CityTemp("Stockholm", new Date(Date.now() - 1004800000), 14),
];

function averageWeeklyTemperature(citytemps: CityTemp[], city: string) {
  city = city.charAt(0).toUpperCase() + city.slice(1);
  const oneWeekAgo = Date.now() - 604800000;

  const filteredCityTemps = citytemps.filter(
    (citytemp) => citytemp.city === city && citytemp.date.getTime() > oneWeekAgo
  );

  const temperature = filteredCityTemps.reduce(
    (result, city) => result + city.temp,
    0
  );
  const averageTemperature = temperature / filteredCityTemps.length;
  return averageTemperature;
}
console.log(averageWeeklyTemperature(cityTemperatures, "stockholm"));

// Alternativ 2
/* Mer kompakt med kedjade funktioner och reduce som ger tillbaks objekt så att jag kan 
spara summa och hur många värden som sparats så att jag vet hur mycket resultatet ska delas med. 
Men kanske mindre lättläsligt. */

function averageWeeklyTemperature2(citytemps: CityTemp[], city: string) {
  city = city.charAt(0).toUpperCase() + city.slice(1);
  const oneWeekAgo = Date.now() - 604800000;

  const filteredCityTemps = citytemps
    .filter(
      (citytemp) =>
        citytemp.city === city && citytemp.date.getTime() > oneWeekAgo
    )
    .reduce(
      (acc, curr) => ({
        sum: acc.sum + curr.temp,
        count: acc.count + 1,
      }),
      { sum: 0, count: 0 }
    );

  return filteredCityTemps.sum / filteredCityTemps.count;
}

// 4. Här tänker jag nog mest att jag hellre vill köra template literal syntax (känns mycket mer lättläst)

// smelly
// function showProduct(
//   name: string,
//   price: number,
//   amount: number,
//   description: string,
//   image: string,
//   parent: HTMLElement
// ) {
//   let container = document.createElement("div");
//   let title = document.createElement("h4");
//   let pris = document.createElement("strong");
//   let imageTag = document.createElement("img");

//   title.innerHTML = name;
//   pris.innerHTML = price.toString();
//   imageTag.src = image;

//   container.appendChild(title);
//   container.appendChild(imageTag);
//   container.appendChild(pris);
//   parent.appendChild(container);
// }

//bättre
// alternativ 1 (superenkel)
function showProduct(
  name: string,
  price: number,
  image: string,
  parent: HTMLElement
) {
  parent.innerHTML = `
    <div>
      <h4>${name}</h4>
      <img src="${image}"/>
      <strong>${price}</strong>
    </div>
  `;
}

//alternativ 2 (med lite dividering i claude)
/* här är det lite mer struktur och funktionen är utbruten till två funktione för att single-res.
varje funktion är ansvarig för endast en sak, den ena visar, den andra skapar. */
interface Product {
  title: String;
  price: Number;
  image: String;
}

function displayProduct(product: Product, parent: HTMLElement): void {
  parent.append(createProductHTML(product));
}

function createProductHTML(product: Product): HTMLElement {
  const { title, image, price } = product;
  const container = document.createElement("div");
  container.innerHTML = `
      <h4>${title}</h4>
      <img src="${image}"/>
      <strong>${price}</strong>
  `;
  return container;
}
/* 5. Ok, här är det inte DRY som gäller. Försöker ta bort all upprepning här och även flytta ut referenser 
till listorna utanför loopen för att inte behöva göra den queryn i varje iterering. */

//smelly
// function presentStudents(students: Student[]) {
//   for (const student of students) {
//     if (student.handedInOnTime) {
//       let container = document.createElement("div");
//       let checkbox = document.createElement("input");
//       checkbox.type = "checkbox";
//       checkbox.checked = true;

//       container.appendChild(checkbox);
//       let listOfStudents = document.querySelector("ul#passedstudents");
//       listOfStudents?.appendChild(container);
//     } else {
//       let container = document.createElement("div");
//       let checkbox = document.createElement("input");
//       checkbox.type = "checkbox";
//       checkbox.checked = false;

//       container.appendChild(checkbox);
//       let listOfStudents = document.querySelector("ul#failedstudents");
//       listOfStudents?.appendChild(container);
//     }
//   }
// }

// bättre (går ju att bryta upp i två funktioner också som fråga 4
function presentStudents(students: Student[]): void {
  const listOfPassedStudents = document.querySelector("ul#passedstudents");
  const listOfFailedStudents = document.querySelector("ul#failedstudents");

  for (const student of students) {
    const container = document.createElement("div");
    container.innerHTML = `
    <input type="checkbox" ${student.handedInOnTime ? "checked" : ""} />
    `;

    student.handedInOnTime
      ? listOfPassedStudents?.append(container)
      : listOfFailedStudents?.append(container);
  }
}

// 6. :)
const strings = ["lorem", "ipsum", "dolor", "sit", "amet"];
function concatenateStrings(array: string[]): string {
  return array.join(" ");
}
console.log(concatenateStrings(strings));
//
function concatenateStrings2(...strings: string[]): string {
  return strings.join(" ");
}
console.log(concatenateStrings2("lorem", "ipsum", "dolor", "sit", "amet"));

/* 7. Här är det första jag ser att det nog är bättre att skapa ett interface för en user 
istället för att mata in alla parametrar en och en. dels för att det kan bli, och redan är, alldeles 
för många parametrar. Hörde nånstans att två är max (om det går att undvika fler vilket det typ alltid borde gå på något sätt).
 Anledning två har med SOLID o ch "open/closed" att göra - vi slipper göra ändringar i funktionen om vi gör det i interface istället. 
 Ändrade även logiken för !userage < 20 till att göra en tidig return istället, cleanare typ. */

// smelly
// function createUser(
//   name: string,
//   birthday: Date,
//   email: string,
//   password: string
// ) {
//   let ageDiff = Date.now() - birthday.getTime();
//   let ageDate = new Date(ageDiff);
//   let userAge = Math.abs(ageDate.getUTCFullYear() - 1970);

//   console.log(userAge);

//   if (!(userAge < 20)) {
//   } else {
//     return "Du är under 20 år";
//   }
// }
interface User {
  name: string;
  birthday: Date;
  email: string;
  password: string;
  avatar: string;
  address: string;
  pancakes: boolean;
}
function createUser(user: User) {
  let ageDiff = Date.now() - user.birthday.getTime();
  let ageDate = new Date(ageDiff);
  let userAge = Math.abs(ageDate.getUTCFullYear() - 1970);

  if (userAge < 20) return "Du är under 20 år";

  // logik för skapa user
}
