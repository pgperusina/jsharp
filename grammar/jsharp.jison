/**
 * JSharp parser
 */

/**
* class imports
**/
%{
	const Import = require('../analizador/instrucciones/Import');
	const Declaracion  = require('../analizador/instrucciones/Declaracion');
	const AsignacionArreglo = require('../analizador/instrucciones/AsignacionArreglo');
	const DefinicionEstructura = require('../analizador/instrucciones/DefinicionEstructura');
	const Funcion = require('../analizador/instrucciones/Funcion');
	const If = require('../analizador/instrucciones/If');
	const IfElse = require('../analizador/instrucciones/IfElse');
	const IfElseIf = require('../analizador/instrucciones/IfElseIf');
	const Switch = require('../analizador/instrucciones/Switch');
	const While = require('../analizador/instrucciones/While');
	const DoWhile = require('../analizador/instrucciones/DoWhile');
	const For = require('../analizador/instrucciones/For');


	const Valor = require('../analizador/expresiones/Valor');
	const Identificador = require('../analizador/expresiones/Identificador');
	const Parametro = require('../analizador/expresiones/Parametro');
	const Caso = require('../analizador/expresiones/Caso');
	const CasoDefault = require('../analizador/expresiones/CasoDefault');

	const Tipo  = require('../analizador/tabla/Tipo').Tipo;
	const Types  = require('../analizador/tabla/Tipo').Types;
	const calificadores  = require('../analizador/tabla/CalificadorTipo').calificadores;
%}

/* Lexical definition */
%lex

%options case-insensitive

%%

/* White spaces */
/* [\r\t]+            {} */
\s+                  {}

/* Comments */
"//".*                             	 	{
                                            console.log("comment one line");
                                            //console.log(yytext);
                                        }
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     {
                                            console.log("comment ML");
                                            //console.log(yytext);
                                        }

"null"				return 'NULL';
"integer"			return 'INTEGER';
"double"			return 'DOUBLE';
"char"				return 'CHAR';
"boolean"			return 'BOOLEAN';
"import"			return 'IMPORT';
"var"				return 'VAR';
"const"				return 'CONST';
"global"			return 'GLOBAL';
"true"				return 'TRUE';
"false"				return 'FALSE';
"if"				return 'IF';
"else"				return 'ELSE';
"switch"			return 'SWITCH';
"case"				return 'CASE';
"default"			return 'DEFAULT';
"break"				return 'BREAK';
"continue"			return 'CONTINUE';
"return"			return 'RETURN';
"print"				return 'PRINT';
"public"			return 'PUBLIC';
"private"			return 'PRIVATE';
"void"				return 'VOID';
"for"				return 'FOR';
"while"				return 'WHILE';
"define"			return 'DEFINE';
"as"				return 'AS';
"strc"				return 'STRC';
"do"				return 'DO';
"try"				return 'TRY';
"catch"				return 'CATCH';
"throw"				return 'THROW';

","                 return 'COMA';
"."                 return 'PUNTO';
";"                 return 'PCOMA';
"("                 return 'PARIZQ';
")"                 return 'PARDER';
"["                 return 'CORIZQ';
"]"                 return 'CORDER';
"{"                 return 'LLAVIZQ';
"}"                 return 'LLAVDER';
":="                return 'DPIGUAL';
":"                 return 'DOSPUNTOS';
"++"                return 'OPINCREMENTO';
"+"                 return 'MAS';
"--"                return 'OPDECREMENTO';
"-"                 return 'MENOS';
"*"                 return 'POR';
"/"                 return 'DIVIDIDO';
"%"                 return 'MODULO';
"^^"                return 'POWER';
"^"              	return 'XOR';
"||"             	return 'OR';
"&&"            	return 'AND';
"==="               return 'TRIPLEIGUAL';
"=="                return 'IGUALA';
"!="                return 'DIFERENTEDE';
"<="                return 'MENORIGUAL';
">="                return 'MAYORIGUAL';
"="                 return 'IGUAL';
">"                	return 'MAYOR';
"<"                	return 'MENOR';
"!"                	return 'NOT';
"$"                	return 'DOLAR';

\"[^\"]*\"				    { 
								yytext = yytext.substr(1,yyleng-2); return 'CADENA'; 
							}
\'[a-zA-ZñÑ^\']\'				    { 
								yytext = yytext.substr(1,yyleng-2); return 'CARACTER'; 
							}
[0-9]+("."[0-9]+)\b         return 'DECIMAL';
[0-9]+\b                    return 'ENTERO';
([a-zA-Z0-9\.\-ñÑ])+[j]		return 'ARCHIVO';
([a-zA-Z_])[a-zA-Z0-9_ñÑ]*	return 'IDENTIFICADOR';

<<EOF>>                     return 'EOF';
.                           { 
								console.error('Error Léxico: ' + yytext + 
								', en la linea: ' + yylloc.first_line + ', y la columna: ' + yylloc.first_column); 
							}
							
/lex

/* Precedence and association - lower to higher*/
/* %left CAST
%right IGUAL
%right OPINCREMENTO OPDECREMENTO
%left AND
%left OR
%left XOR
%left IGUALA DIFERENTEDE TRIPLEIGUAL
%nonassoc MENOR MAYOR MENORIGUAL MAYORIGUAL
%left MAS MENOS
%left POR DIVIDIDO MODULO
%left PUNTO*/
%right POWER
%right UMENOS NOT 

%start initial

%% /* Grammar definition */

initial
	: instrucciones EOF
;

instrucciones
	: instrucciones instruccion {
		$$ = $1;
		$$.push($2);
	}
	| instruccion {
		$$ = [$1];
	}
;

instruccion
	: imports {
		$$ = new Import($1, this._$.first_line, this._$.first_column);
		/* $$ = $1; */
		console.log("IMPORTS |||| " +JSON.stringify($$, null, 2));
	}
	| declaraciones PCOMA {
		$$ = $1;
		console.log("DECLARACION |||| " + JSON.stringify($$, null, 2));
	}
	| asignacionArreglo PCOMA {
		$$ = $1;
		console.log("ASIGNACION ARREGLO |||| " + JSON.stringify($$, null, 2));
	}
	| definicionEstructura PCOMA {
		$$ = $1;
		console.log("DEFINICION ESTRUCTURA |||| " + JSON.stringify($$, null, 2));
	}
	| definicionFuncion {
		$$ = $1;
		console.log("FUNCION |||| " + JSON.stringify($$, null, 2));
	}
	| if {
		$$ = $1;
		console.log("IF |||| " + JSON.stringify($$, null, 2));
	}
	| switch {
		$$ = $1;
		console.log("SWITCH |||| " + JSON.stringify($$, null, 2));
	}
	| while {
		$$ = $1;
		console.log("WHILE |||| " +JSON.stringify($$, null, 2));
	}
	| doWhile {
		$$ = $1;
		console.log("DOWHILE |||| " + JSON.stringify($$, null, 2));
	}
	| for {
		$$ = $1;
		console.log("FOR |||| " + JSON.stringify($$, null, 2));
	}
	| break PCOMA {
		$$ = $1;
	}
	| continue PCOMA {
		$$ = $1;
	}
	| return PCOMA {
		$$ = $1;
	}
	| print PCOMA {
		$$ = $print;
		console.log("PRINT |||| " + JSON.stringify($$, null, 2));
	}
	| trycatch {
		$$ = $1;
		console.log("TRY-CATCH |||| " + JSON.stringify($$, null, 2));
	}
	| throw PCOMA {
		$$ = $1;
		console.log("THROW |||| " + JSON.stringify($$, null, 2));
	}
	| expresion PCOMA{
		$$ = $1;
		console.log("EXPRESION |||| " + JSON.stringify($$, null, 2));
	}
	| error  PCOMA{
			console.error('Error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
			//$$ = "ERROR"
	}
;

// IMPORTS
imports
	: IMPORT import  {
			$$ = $2;
			//todo crear nodo (import)
		}
;

import
	: import COMA ARCHIVO {
			$$ = $1;
			$$.push($3);
		}
	| ARCHIVO {
			$$ = [$1];
		}
;

// DECLARACIONES Y ASIGNACIONES

declaraciones
	: definicionTipo listaIds IGUAL expresion {  // declaracion tipo 1
		$$ = new Declaracion($1, null, $2, $4, this._$.first_line, this._$.first_column);
		/* $$ = $1 + $2 + $3 + $4; */
	}
	| definicionTipo listaIds {  // declaracion tipo 5
		$$ = new Declaracion($1, null, $2, null, this._$.first_line, this._$.first_column);
		/* $$ = $1 + $2; */
	}
	| calificadorTipo IDENTIFICADOR DPIGUAL expresion {  // declaracion tipo 2, 3 y 4 - incluye estructuras en expresion (strc)
		$$ = new Declaracion(null, $1, $2, $4, this._$.first_line, this._$.first_column);
		/* $$ = $1 + $2 + $3 + $4; */
	}
	| IDENTIFICADOR listaIds IGUAL expresion {  // declaracion estructuras
		$$ = new Declaracion(new Tipo(null, false, $1), null, $2, $4, this._$.first_line, this._$.first_column);
		/* $$ = $1 + $2 + $3 + $4 ; */
	} 
	| IDENTIFICADOR CORIZQ CORDER IDENTIFICADOR IGUAL expresion {  // declaracion arreglos de estructuras
		$$ = new Declaracion(new Tipo(null, true, $1), null, $4, $6, this._$.first_line, this._$.first_column);
		/* $$ = $1 + $2 + $3 + $4 + $5 + $6 ; */
	}
;

definicionTipo
	: tipo CORIZQ CORDER {
		$$ = new Tipo($1, true, null)
		/* $$ = $1 + $2 + $3; */
	}
	| tipo {
		$$ = new Tipo($1, false, null)
		/* $$ = $1; */
		/* $$ = $1; */
	}
;

tipo
	: INTEGER {
		$$ = Types.INTEGER;
		/* $$ = $1; */
	}
	| DOUBLE {
		$$ = Types.DOUBLE;
		/* $$ = $1; */
	}
	| CHAR {
		$$ = Types.CHAR;
		/* $$ = $1; */
	}
	| BOOLEAN {
		$$ = Types.BOOLEAN;
		/* $$ = $1; */
	}
	| VOID {
		$$ = Types.VOID;
		/* $$ = $1; */
	}
;

listaIds
	: listaIds COMA IDENTIFICADOR {
		$$ = $1;
		$$.push($3);
	}
	| IDENTIFICADOR {
		$$ = [$1];
	}
;

calificadorTipo
	: VAR {
		$$ = calificadores.VAR;
		/* $$ = $1; */
	}
	| CONST {
		$$ = calificadores.CONST;
		/* $$ = $1; */
	}
	| GLOBAL {
		$$ = calificadores.GLOBAL;
		/* $$ = $1; */
	}
;

asignacionArreglo
	: IDENTIFICADOR CORIZQ expresion CORDER IGUAL expresion {
		$$ = new AsignacionArreglo($1, $3, $6);
		/* $$ = $1 + $2 + $3 + $4 + $5 + $6; */
	}
;

definicionEstructura
	: DEFINE IDENTIFICADOR AS CORIZQ listaParametros CORDER {
		$$ = new DefinicionEstructura($2, $5, this._$.first_line, this._$.first_column);
		/* $$ = $1 + $2 + $3 + $4 + $5 + $6; */
	}
;
//FUNCIONES
definicionFuncion
	: definicionTipo IDENTIFICADOR PARIZQ listaParametros PARDER bloqueInstrucciones {
		/* $$ = $1 + " " + $2 + "(" + $listaParametros + ")" + $bloqueInstrucciones; */
		$$ = new Funcion($1, $2, $4, $6, this._$.first_line, this._$.first_column);
	}
	| definicionTipo IDENTIFICADOR PARIZQ  PARDER bloqueInstrucciones {
		/* $$ = $1 + " " + $2 + "( )" + $5; */
		$$ = new Funcion($1, $2, null, $5, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR IDENTIFICADOR PARIZQ listaParametros PARDER bloqueInstrucciones {
		/* $$ = $1 + " " + $2 + "(" + $listaParametros + ")" + $bloqueInstrucciones; */
		$$ = new Funcion(new Tipo(null, false, $1), $2, $4, $6, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR IDENTIFICADOR PARIZQ  PARDER bloqueInstrucciones {
		/* $$ = $1 + " " + $2 + "( )" + $bloqueInstrucciones; */
		$$ = new Funcion(new Tipo(null, false, $1), $2, null, $5, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR CORIZQ CORDER IDENTIFICADOR PARIZQ listaParametros PARDER bloqueInstrucciones {
		/* $$ = $1 + $2 + $3 + $4 + $5 + $6 + $7 + $8; */
		$$ = new Funcion(new Tipo(null, true, $1), $4, $6, $8, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR CORIZQ CORDER IDENTIFICADOR PARIZQ PARDER bloqueInstrucciones {
		/* $$ = $1 + $2 + $3 + $4 + $5 + $6 + $7; */
		$$ = new Funcion(new Tipo(null, true, $1), $4, null, $7, this._$.first_line, this._$.first_column);
	}
;

listaParametros
	: listaParametros COMA parametro {
		$$ = $1;
		$$.push($3);
	}
	| parametro {
		$$ = [$1];
	}
;

parametro
	: definicionTipo IDENTIFICADOR {
		/* $$ = $1 + " " + $2; */
		$$ = new Parametro($1, $2, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR IDENTIFICADOR {
		/* $$ = $1 + " " + $2; */
		$$ = new Parametro(new Tipo(null, false, $1), $2, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR CORIZQ CORDER IDENTIFICADOR {
		/* $$ = $1 + $2 + $3 + " " + $4; */
		$$ = new Parametro(new Tipo(null, true, $1), $4, this._$.first_line, this._$.first_column);
	}
;

//CONTROL DE FLUJO
if
	: IF PARIZQ expresion PARDER bloqueInstrucciones { 
        /* $$ = $1 + $2 + $3 + $4 + $5; */
		$$ = new If($3, $5, this._$.first_line, this._$.first_column);
		}
	| IF PARIZQ expresion PARDER bloqueInstrucciones ELSE  if { 
		/* $$ = $1 + $2 + $3 + $4 + $5 + $6 + $7; */
		$$ = new IfElseIf($3, $5, $7, this._$.first_line, this._$.first_column);
		}
	| IF PARIZQ expresion PARDER bloqueInstrucciones ELSE bloqueInstrucciones { 
		/* $$ = $1 + $2 + $3 + $4 + $5 + $6 + $7; */
		$$ = new IfElse($3, $5, $7, this._$.first_line, this._$.first_column);
		}
;

bloqueInstrucciones
	: LLAVIZQ instrucciones LLAVDER {
		$$ = $2;
	}
;

switch
	: SWITCH PARIZQ expresion PARDER LLAVIZQ cases LLAVDER {
		/* $$ = $1 + $2 + $3 +$4 + $5 + $6 + $7; */
		$$ = new Switch($3, $6, this._$.first_line, this._$.first_column);
		// todo - crear nodo switch
	}
;

cases
	: cases case {
		$$ = $1;
		$$.push($2);
	}
	| case {
		$$ = [$1];
	}
; 

case
	: CASE expresion DOSPUNTOS instrucciones {
		/* $$ = $1 + $2 + $3 +$4; */
		$$ = new Caso($2, $4, this._$.first_line, this._$.first_column);
	}
	| DEFAULT DOSPUNTOS instrucciones {
		/* $$ = $1 + $2 + $3 */
		$$ = new CasoDefault($3, this._$.first_line, this._$.first_column);
	}
;

while
	: WHILE PARIZQ expresion PARDER bloqueInstrucciones {
		/* $$ = $1 + $2 + $3 +$4 + $5; */
		$$ = new While($3, $5, this._$.first_line, this._$.first_column);
	}
;

doWhile
	: DO bloqueInstrucciones WHILE PARIZQ expresion PARDER {
		/* $$ = $1 + $2 + $3 +$4 + $5 + $6; */
		$$ = new DoWhile($5, $2, this._$.first_line, this._$.first_column);
	}
;

for
	: FOR PARIZQ inicio condicion final PARDER bloqueInstrucciones {
		/* $$ = $1 + $2 + $3 +$4 + $5 + $6 + $7; */
		$$ = new For($3, $4, $5, $7, this._$.first_line, this._$.first_column);
	}
;

inicio
	: declaraciones PCOMA { 
		$$ = $1;
	}
	| PCOMA { $$ = null; }
;

condicion
	: expresionOrExclusivo PCOMA { 
		$$ = $1;
	}
	| PCOMA { $$ = null; }
;

final
	: expresion { 
		$$ = $1;
	}
	| { $$ = null; }
;

break
	: BREAK {
		$$ = $1;
		// todo - crear nodo break
	}
;

continue
	: CONTINUE {
		$$ = $1;
		// todo - crear nodo continue
	}
;

return
	: RETURN expresion {
		$$ = $1 + " " + $2;
		// todo - crear nodo return
	}
;

//CASTEO




llamada
	: IDENTIFICADOR PARIZQ listaArgumentos PARDER {
		$$ = $1 + "(" + $3 + ")";
		console.log("LLAMADA  -- " +$$);
		// todo - crear nodo llamada
	}
	/* | ids_anidados PARIZQ listaArgumentos PARDER {
		$$ = $1 + $2 + $3 + $4;
		console.log("LLAMADA ANIDADOS -- " +$$);
	} */

;


listaArgumentos
	: listaArgumentos COMA argumento {
		$$ = $1;
		$$.push($3);
	}
	| argumento {
		$$ = [$1];
	}
	| {
		$$ = "";
	}
;

argumento
	: IDENTIFICADOR IGUAL expresion {
		$$ = $1 + "=" + $3;
	}
	| expresion {
		$$ = $1;
	}
	| DOLAR IDENTIFICADOR{
		$$ = $1 + $2;
		console.log("ARGUMENTO DOLAR " + $$);
	}
;

print
	: PRINT PARIZQ expresion PARDER {
		$$ = $PRINT + $2 + $3 + $4;
	}
;

trycatch
	: TRY bloqueInstrucciones CATCH PARIZQ IDENTIFICADOR IDENTIFICADOR PARDER bloqueInstrucciones {
		$$ = $2 + $3 + $4 + $5 + $6 +$7 + $8;
	}
;

throw
	: THROW STRC expresionPostfix {
		$$ = $1 + " " + $2 + " " + $3;
	}
;


// EXPRESIONES
expresion
	: expresionAsignacion {
		$$ = $1;
	}
	/* | expresion COMA expresionAsignacion {
		$$ = $1 + $2 + $3;
	} */
/* 	| error PCOMA {
			console.error('Error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
			//$$ = "ERROR"
	} */
;

expresionAsignacion
	: expresionOrExclusivo {
		$$ = $1;
	}
	| expresionAsignacion IGUAL expresionOrExclusivo {
		$$ = $1 + $2 + $3;
	}
;

expresionOrExclusivo
	: expresionOr {
		$$ = $1;
	}
	| expresionOrExclusivo XOR expresionOr {
		$$ = $1 + $2 + $3;
	}
;

expresionOr
	: expresionAnd {
		$$ = $1;
	}
	| expresionOr OR expresionAnd {
		$$ = $1 + $2 + $3;
	}
;

expresionAnd
	: expresionIgualdad {
		$$ = $1;
	}
	| expresionAnd AND expresionIgualdad {
		$$ = $1 + $2 + $3;
	}
;

expresionIgualdad
	: expresionRelacional {
		$$ = $1;
	}
	| expresionIgualdad TRIPLEIGUAL expresionRelacional {
		$$ = $1 + $2 + $3;
	}
	| expresionIgualdad IGUALA expresionRelacional {
		$$ = $1 + $2 + $3;
	}
	| expresionIgualdad DIFERENTEDE expresionRelacional {
		$$ = $1 + $2 + $3;
	}
;

expresionRelacional
	: expresionAditiva {
		$$ = $1;
	}
	| expresionRelacional MAYOR expresionAditiva {
		$$ = $1 + $2 + $3;
	}
	| expresionRelacional MAYORIGUAL expresionAditiva {
		$$ = $1 + $2 + $3;
	}
	| expresionRelacional MENOR expresionAditiva {
		$$ = $1 + $2 + $3;
	}
	| expresionRelacional MENORIGUAL expresionAditiva {
		$$ = $1 + $2 + $3;
	}
;

expresionAditiva
	: expresionMultiplicativa {
		$$ = $1;
	}
	| expresionAditiva MAS expresionMultiplicativa {
		$$ = $1 + $2 + $3;
	}
	| expresionAditiva MENOS expresionMultiplicativa {
		$$ = $1 + $2 + $3;
	}
;

expresionMultiplicativa
	: expresionCasteo {
		$$ = $1;
	}
	| expresionMultiplicativa POR expresionCasteo {
		$$ = $1 + $2 + $3;
	}
	| expresionMultiplicativa DIVIDIDO expresionCasteo {
		$$ = $1 + $2 + $3;
	}
	| expresionMultiplicativa MODULO expresionCasteo {
		$$ = $1 + $2 + $3;
	}
;

expresionCasteo
	: expresionUnaria {
		$$ = $1;
	}
	| PARIZQ tipo PARDER expresionCasteo {
		$$ = $1 + $2 + $3 + $4;
	}
;

expresionUnaria
	: expresionPostfix {
		$$ = $1;
	}
	| NOT expresionUnaria {
		$$ = $1 + $2;
	}
	| MENOS expresionUnaria %prec UMENOS {
		$$ = $1 + $2;
	}
	| expresionUnaria POWER expresionUnaria {
		$$ = $1 + $2 + $3;
	}
;

expresionPostfix
	: expresionPrimaria {
		$$ = $1;
	}
	| expresionPostfix CORIZQ expresion CORDER {
		$$ = $1 + $2 + $3 + $4;
	}
	| expresionPostfix CORIZQ CORDER {
		$$ = $1 + $2 + $3;
	}
	| expresionPostfix PARIZQ PARDER {
		$$ = $1 + $2 + $3;
	}
	| expresionPostfix PARIZQ expresionListaArgumentos PARDER {
		$$ = $1 + $2 + $3 + $4;
	}
	| expresionPostfix PUNTO IDENTIFICADOR {
		$$ = $1 + $2 + $3;
	}
	| expresionPostfix OPINCREMENTO {
		$$ = $1 + $2;
	}
	| expresionPostfix OPDECREMENTO {
		$$ = $1 + $2;
	}
;

expresionListaArgumentos
	: expresionAsignacion {
		$$ = [$1];
	}
	| expresionListaArgumentos COMA expresionAsignacion {
		$$ = $1;
		$$.push($3);
	}
;

expresionPrimaria
	: IDENTIFICADOR {
		$$ = new Identificador($1, this._$.first_line, this._$.first_column);
		/* $$ = $1; */
	}
	| CADENA {
		$$ = new Valor(new Tipo(Types.STRING, false, null), $1, this._$.first_line, this._$.first_column);
	}
	| CARACTER {
		$$ = new Valor(new Tipo(Types.CHAR, false, null), $1, this._$.first_line, this._$.first_column);
		/* $$ = $1; */
	}
	| ENTERO {
		$$ = new Valor(new Tipo(Types.INTEGER, false, null), $1, this._$.first_line, this._$.first_column);
		/* $$ = Number($1); */
	}
	| DECIMAL {
		$$ = new Valor(new Tipo(Types.DOUBLE, false, null), $1, this._$.first_line, this._$.first_column);
		/* $$ = Number($1); */
	}
	| TRUE {
		$$ = new Valor(new Tipo(Types.BOOLEAN, false, null), 1, this._$.first_line, this._$.first_column);
		/* $$ = $1 */
	}
	| FALSE {
		$$ = new Valor(new Tipo(Types.BOOLEAN, false, null), 0, this._$.first_line, this._$.first_column);
		/* $$ = $1 */
	}
	| DOLAR IDENTIFICADOR {
		$$ = $1 + $2;
	}
	| STRC IDENTIFICADOR { //new Estudiante (inicializador de estructuras)
		$$ = $1 + $2;
	}
	| STRC tipo { //new integer (inicializador de estructuras)
		$$ = $1 + $2;
	}
	| NULL  {
		$$ = new Valor(new Tipo(Types.NULL, false, null), 'null', this._$.first_line, this._$.first_column);
	}
	| LLAVIZQ expresionListaArgumentos LLAVDER {
		$$ = $2;
	}
	| PARIZQ expresion PARDER {
		$$ = $2
	}
;