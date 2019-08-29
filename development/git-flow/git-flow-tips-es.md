# Git-flow

## Installing on Linux, Unix, etc.

https://github.com/petervanderdoes/gitflow-avh/wiki/Installing-on-Linux,-Unix,-etc

### Ubuntu 18.04:

La edición AVH de git-flow está empaquetada con Ubuntu.
Puede instalar la última versión de git-flow AVH Edition usando:

$ sudo apt-get install git-flow

## Recomendations

recomiendo que instales dos extensiones de vscode Git Graph y BABA-Git flow

Una vez clonados los repositorios

npm install 

en cada uno

y luego inicializas con git flow (tioenes que instalar git flow en tu mauina primero)

Ubuntu 18.04: 

git-flow AVH edition is packaged with Ubuntu. You can install the last version of git-flow AVH Edition using:
$ sudo apt-get install git-flow


luego de inicializar el repositorio con git-flow usas el esquema de comandos (ctrl + may +p )
escribes git-flow y aparecen todos los comandos necesarios

git-flow inint

inicializa el repositorio local y hace las preguntas de configuracion (use los valores por defecto menos la del prefijo que le puse v)

De ahi en adelante simplemente el sistema crea una rama automaticamente por cada feature y l destruye automaticamente cuando la finalizas

git-flow start (nombre de rama)
git-flow finisf (nombre de la rama)

puedes hacer varias ramas y trabajar en varias simultaneamente

luego todas se4 mezclan y llegan al develop

a master se pasa solo despues de probar todo

asi que el destino final es siempre develop
