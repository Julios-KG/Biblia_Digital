# Textos bíblicos opcionales

Mi Biblia Digital **no incluye ninguna traducción**. Esta carpeta es el lugar donde quien publica la app puede
añadir una versión que sea de **dominio público** o que tenga **autorizada**. No añadas textos sin permiso.

## Cómo añadir una versión

1. Crea una carpeta con el identificador de la versión (minúsculas, números, guiones), por ejemplo `public/biblia/mi-version/`.
2. Dentro, un archivo por libro con el código del libro: `GEN.json`, `EXO.json`, …, `REV.json`.
3. Cada archivo tiene esta forma (el índice 0 del arreglo es el versículo 1):

```json
{
  "1": ["Texto del versículo 1", "Texto del versículo 2"],
  "2": ["Texto del versículo 1"]
}
```

4. Registra la versión en `public/biblia/index.json`:

```json
{
  "versions": [
    { "id": "mi-version", "name": "Nombre de la versión", "license": "Dominio público / permiso de …" }
  ]
}
```

## Códigos de libro

GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA
JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN
3JN JUD REV

## Alternativa sin publicar nada

Cada persona puede importar su propio archivo desde **Ajustes → Textos bíblicos → Importar archivo JSON**.
El texto se guarda solo en su navegador (IndexedDB).
