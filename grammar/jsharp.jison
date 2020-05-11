/**
 * JSharp parser
 */

/**
* class imports
**/
%{
	const Arbol = require('../analizador/Arbol');
	const errores = [];
	const Excepcion = require('../analizador/Excepciones/Excepcion');

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
	const TryCatch = require('../analizador/instrucciones/TryCatch');
	const Print = require('../analizador/instrucciones/Print');


	const Valor = require('../analizador/expresiones/Valor');
	const Cadena = require('../analizador/expresiones/Cadena');
	const Identificador = require('../analizador/expresiones/Identificador');
	const Parametro = require('../analizador/expresiones/Parametro');
	const Caso = require('../analizador/expresiones/Caso');
	const CasoDefault = require('../analizador/expresiones/CasoDefault');
	const AccesoArreglo = require('../analizador/expresiones/AccesoArreglo');
	const LlamadaFuncion = require('../analizador/expresiones/LlamadaFuncion');
	const AccesoPropiedadEstructura = require('../analizador/expresiones/AccesoPropiedadEstructura');
	const ExpresionPostIncremento = require('../analizador/expresiones/ExpresionPostIncremento');
	const ExpresionPostDecremento = require('../analizador/expresiones/ExpresionPostDecremento');
	const ExpresionAsignacion = require('../analizador/expresiones/ExpresionAsignacion');
	const ParametroPorValor = require('../analizador/expresiones/ParametroPorValor');
	const InstanciaEstructura = require('../analizador/expresiones/InstanciaEstructura');
	const Arreglo = require('../analizador/expresiones/Arreglo');
	const ArregloExplicito = require('../analizador/expresiones/ArregloExplicito');
	const Throw = require('../analizador/expresiones/Throw');
	const ExpresionUnaria = require('../analizador/expresiones/ExpresionUnaria');
	const ExpresionPotencia = require('../analizador/expresiones/ExpresionPotencia');
	const ExpresionCasteo = require('../analizador/expresiones/ExpresionCasteo');
	const Return = require('../analizador/expresiones/Return');
	const ExpresionRelacional = require('../analizador/expresiones/ExpresionRelacional');
	const ExpresionMultiplicativa = require('../analizador/expresiones/ExpresionMultiplicativa');
	const ExpresionLogica = require('../analizador/expresiones/ExpresionLogica');
	const ExpresionIgualdad = require('../analizador/expresiones/ExpresionIgualdad');
	const ExpresionAditiva = require('../analizador/expresiones/ExpresionAditiva');
	const Continue = require('../analizador/expresiones/Continue');
	const Break = require('../analizador/expresiones/Break');

	const Tipo  = require('../analizador/tabla/Tipo').Tipo;
	const Types  = require('../analizador/tabla/Tipo').Types;
	const CalificadorTipo  = require('../analizador/tabla/CalificadorTipo').calificadores;
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
                                            //console.log("comment one line");
                                            //console.log(yytext);
                                        }
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     {
                                            //console.log("comment ML");
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
								let error =  new Excepcion("Léxico", 'Caracter no aceptado: [' + yytext + ']', yylloc.first_line, yylloc.first_column);
								errores.push(error);
								console.log(error.toString());
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
	: instrucciones EOF {
		arbol = new Arbol($1);
		arbol.errores = errores;
		return arbol;
	}
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
		//console.log("IMPORTS |||| " +JSON.stringify($$, null, 2));
	}
	| declaraciones PCOMA {
		$$ = $1;
		//console.log("DECLARACION |||| " + JSON.stringify($$, null, 2));
	}
	| asignacionArreglo PCOMA {
		$$ = $1;
		//console.log("ASIGNACION ARREGLO |||| " + JSON.stringify($$, null, 2));
	}
	| definicionEstructura PCOMA {
		$$ = $1;
		//console.log("DEFINICION ESTRUCTURA |||| " + JSON.stringify($$, null, 2));
	}
	| definicionFuncion {
		$$ = $1;
		//console.log("FUNCION |||| " + JSON.stringify($$, null, 2));
	}
	| if {
		$$ = $1;
		//console.log("IF |||| " + JSON.stringify($$, null, 2));
	}
	| switch {
		$$ = $1;
		//console.log("SWITCH |||| " + JSON.stringify($$, null, 2));
	}
	| while {
		$$ = $1;
		//console.log("WHILE |||| " +JSON.stringify($$, null, 2));
	}
	| doWhile {
		$$ = $1;
		//console.log("DOWHILE |||| " + JSON.stringify($$, null, 2));
	}
	| for {
		$$ = $1;
		//console.log("FOR |||| " + JSON.stringify($$, null, 2));
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
		//console.log("PRINT |||| " + JSON.stringify($$, null, 2));
	}
	| trycatch {
		$$ = $1;
		//console.log("TRY-CATCH |||| " + JSON.stringify($$, null, 2));
	}
	| throw PCOMA {
		$$ = $1;
		//console.log("THROW |||| " + JSON.stringify($$, null, 2));
	}
	| expresion PCOMA{
		$$ = $1;
		//console.log("EXPRESION |||| " + JSON.stringify($$, null, 2));
	}
	| error {
			let error =  new Excepcion("Sintáctico", 'Caracter no esperado: [' + yytext + ']', this._$.first_line, this._$.first_column);
			errores.push(error);
			console.error('Error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' 
			+ this._$.first_column);
			//". Se esperaba [" + JSON.stringify($1) + "]."); 
			//$$ = "ERROR"
	}
;

// IMPORTS
imports
	: IMPORT import  {
			$$ = $2;
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
	}
	| definicionTipo listaIds {  // declaracion tipo 5
		$$ = new Declaracion($1, null, $2, null, this._$.first_line, this._$.first_column);
	}
	| calificadorTipo IDENTIFICADOR DPIGUAL expresion {  // declaracion tipo 2, 3 y 4 - incluye estructuras en expresion (strc)
		$$ = new Declaracion(new Tipo("", false, null), $1, [$2], $4, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR listaIds IGUAL expresion {  // declaracion estructuras
		$$ = new Declaracion(new Tipo("", false, $1), null, $2, $4, this._$.first_line, this._$.first_column);
	} 
	| IDENTIFICADOR CORIZQ CORDER listaIds IGUAL expresion {  // declaracion arreglos de estructuras
		$$ = new Declaracion(new Tipo("", true, $1), null, $4, $6, this._$.first_line, this._$.first_column);
	}
;

definicionTipo
	: tipo CORIZQ CORDER {
		$$ = new Tipo($1, true, null)
	}
	| tipo {
		$$ = new Tipo($1, false, null)
	}
;

tipo
	: INTEGER {
		$$ = Types.INTEGER;
	}
	| DOUBLE {
		$$ = Types.DOUBLE;
	}
	| CHAR {
		$$ = Types.CHAR;
	}
	| BOOLEAN {
		$$ = Types.BOOLEAN;
	}
	| VOID {
		$$ = Types.VOID;
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
		$$ = CalificadorTipo.VAR;
	}
	| CONST {
		$$ = CalificadorTipo.CONST;
	}
	| GLOBAL {
		$$ = CalificadorTipo.GLOBAL;
	}
;

asignacionArreglo
	: IDENTIFICADOR CORIZQ expresion CORDER IGUAL expresion {
		$$ = new AsignacionArreglo($1, $3, $6, this._$.first_line, this._$.first_column);
	}
;

definicionEstructura
	: DEFINE IDENTIFICADOR AS CORIZQ listaParametros CORDER {
		$$ = new DefinicionEstructura($2, $5, this._$.first_line, this._$.first_column);
	}
;

//FUNCIONES
definicionFuncion
	: definicionTipo IDENTIFICADOR PARIZQ listaParametros PARDER bloqueInstrucciones {
		$$ = new Funcion($1, $2, $4, $6, this._$.first_line, this._$.first_column);
	}
	| definicionTipo IDENTIFICADOR PARIZQ  PARDER bloqueInstrucciones {
		$$ = new Funcion($1, $2, [], $5, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR IDENTIFICADOR PARIZQ listaParametros PARDER bloqueInstrucciones {
		$$ = new Funcion(new Tipo("", false, $1), $2, $4, $6, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR IDENTIFICADOR PARIZQ  PARDER bloqueInstrucciones {
		$$ = new Funcion(new Tipo("", false, $1), $2, [], $5, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR CORIZQ CORDER IDENTIFICADOR PARIZQ listaParametros PARDER bloqueInstrucciones {
		$$ = new Funcion(new Tipo("", true, $1), $4, $6, $8, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR CORIZQ CORDER IDENTIFICADOR PARIZQ PARDER bloqueInstrucciones {
		$$ = new Funcion(new Tipo("", true, $1), $4, [], $7, this._$.first_line, this._$.first_column);
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
		$$ = new Parametro($1, $2, null, this._$.first_line, this._$.first_column);
	}
	| definicionTipo IDENTIFICADOR IGUAL expresion {
		$$ = new Parametro($1, $2, $4, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR IDENTIFICADOR {
		$$ = new Parametro(new Tipo("", false, $1), $2, null, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR IDENTIFICADOR IGUAL expresion {
		$$ = new Parametro(new Tipo("", false, $1), $2, $4, this._$.first_line, this._$.first_column);
	}
	| IDENTIFICADOR CORIZQ CORDER IDENTIFICADOR {
		$$ = new Parametro(new Tipo("", true, $1), $4, null, this._$.first_line, this._$.first_column);
	}
;

//CONTROL DE FLUJO
if
	: IF PARIZQ expresion PARDER bloqueInstrucciones { 
		$$ = new If($3, $5, this._$.first_line, this._$.first_column);
		}
	| IF PARIZQ expresion PARDER bloqueInstrucciones ELSE  if { 
		$$ = new IfElseIf($3, $5, $7, this._$.first_line, this._$.first_column);
		}
	| IF PARIZQ expresion PARDER bloqueInstrucciones ELSE bloqueInstrucciones { 
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
		$$ = new Switch($3, $6, this._$.first_line, this._$.first_column);
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
		$$ = new Caso($2, $4, this._$.first_line, this._$.first_column);
	}
	| DEFAULT DOSPUNTOS instrucciones {
		$$ = new CasoDefault($3, this._$.first_line, this._$.first_column);
	}
;

while
	: WHILE PARIZQ expresion PARDER bloqueInstrucciones {
		$$ = new While($3, $5, this._$.first_line, this._$.first_column);
	}
;

doWhile
	: DO bloqueInstrucciones WHILE PARIZQ expresion PARDER {
		$$ = new DoWhile($5, $2, this._$.first_line, this._$.first_column);
	}
;

for
	: FOR PARIZQ inicio condicion final PARDER bloqueInstrucciones {
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
		$$ = new Break(this._$.first_line, this._$.first_column);
	}
;

continue
	: CONTINUE {
		$$ = new Continue(this._$.first_line, this._$.first_column);
	}
;

return
	: RETURN expresion {
		$$ = new Return($2, this._$.first_line, this._$.first_column);
	}
;

print
	: PRINT PARIZQ expresion PARDER {
		$$ = new Print($3, this._$.first_line, this._$.first_column);
	}
;

trycatch
	: TRY bloqueInstrucciones CATCH PARIZQ IDENTIFICADOR IDENTIFICADOR PARDER bloqueInstrucciones {
		$$ = new TryCatch($2, $5, $6, $8, this._$.first_line, this._$.first_column);
	}
;

throw
	: THROW STRC IDENTIFICADOR PARIZQ PARDER {
		$$ = new Throw($3, this._$.first_line, this._$.first_column);
	}
;


// EXPRESIONES
expresion
	: expresionAsignacion {
		$$ = $1;
	}
;

expresionAsignacion
	: expresionOrExclusivo {
		$$ = $1;
	}
	| expresionAsignacion IGUAL expresionOrExclusivo {
		$$ = new ExpresionAsignacion($1, $3, this._$.first_line, this._$.first_column);
	}
;

expresionOrExclusivo
	: expresionOr {
		$$ = $1;
	}
	| expresionOrExclusivo XOR expresionOr {
		$$ = new ExpresionLogica($1, $2, $3, this._$.first_line, this._$.first_column);
	}
;

expresionOr
	: expresionAnd {
		$$ = $1;
	}
	| expresionOr OR expresionAnd {
		$$ = new ExpresionLogica($1, $2, $3, this._$.first_line, this._$.first_column);
	}
;

expresionAnd
	: expresionIgualdad {
		$$ = $1;
	}
	| expresionAnd AND expresionIgualdad {
		$$ = new ExpresionLogica($1, $2, $3, this._$.first_line, this._$.first_column);
	}
;

expresionIgualdad
	: expresionRelacional {
		$$ = $1;
	}
	| expresionIgualdad TRIPLEIGUAL expresionRelacional {
		$$ = new ExpresionIgualdad($1, $2, $3, this._$.first_line, this._$.first_column);
	}
	| expresionIgualdad IGUALA expresionRelacional {
		$$ = new ExpresionIgualdad($1, $2, $3, this._$.first_line, this._$.first_column);
	}
	| expresionIgualdad DIFERENTEDE expresionRelacional {
		$$ = new ExpresionIgualdad($1, $2, $3, this._$.first_line, this._$.first_column);
	}
;

expresionRelacional
	: expresionAditiva {
		$$ = $1;
	}
	| expresionRelacional MAYOR expresionAditiva {
		$$ = new ExpresionRelacional($1, $2, $3, this._$.first_line, this._$.first_column);
	}
	| expresionRelacional MAYORIGUAL expresionAditiva {
		$$ = new ExpresionRelacional($1, $2, $3, this._$.first_line, this._$.first_column);
	}
	| expresionRelacional MENOR expresionAditiva {
		$$ = new ExpresionRelacional($1, $2, $3, this._$.first_line, this._$.first_column);
	}
	| expresionRelacional MENORIGUAL expresionAditiva {
		$$ = new ExpresionRelacional($1, $2, $3, this._$.first_line, this._$.first_column);
	}
;

expresionAditiva
	: expresionMultiplicativa {
		$$ = $1;
	}
	| expresionAditiva MAS expresionMultiplicativa {
		$$ = new ExpresionAditiva($1, $2, $3, this._$.first_line, this._$.first_column);
	}
	| expresionAditiva MENOS expresionMultiplicativa {
		$$ = new ExpresionAditiva($1, $2, $3, this._$.first_line, this._$.first_column);
	}
;

expresionMultiplicativa
	: expresionCasteo {
		$$ = $1;
	}
	| expresionMultiplicativa POR expresionCasteo {
		$$ = new ExpresionMultiplicativa($1, $2, $3, this._$.first_line, this._$.first_column);
	}
	| expresionMultiplicativa DIVIDIDO expresionCasteo {
		$$ = new ExpresionMultiplicativa($1, $2, $3, this._$.first_line, this._$.first_column);
	}
	| expresionMultiplicativa MODULO expresionCasteo {
		$$ = new ExpresionMultiplicativa($1, $2, $3, this._$.first_line, this._$.first_column);
	}
;

expresionCasteo
	: expresionUnaria {
		$$ = $1;
	}
	| PARIZQ tipo PARDER expresionCasteo {
		$$ = new ExpresionCasteo($2, $4, this._$.first_line, this._$.first_column);
	}
;

expresionUnaria
	: expresionPostfix {
		$$ = $1;
	}
	| NOT expresionUnaria {
		$$ = new ExpresionUnaria($2, $1, this._$.first_line, this._$.first_column);
	}
	}
	| MENOS expresionUnaria %prec UMENOS {
		$$ = new ExpresionUnaria($2, $1, this._$.first_line, this._$.first_column);
	}
	| expresionUnaria POWER expresionUnaria {
		$$ = new ExpresionPotencia($1, $2, $3, this._$.first_line, this._$.first_column);
	}
;

expresionPostfix
	: expresionPrimaria {
		$$ = $1;
	}
	| expresionPostfix CORIZQ expresion CORDER {
		$$ = new AccesoArreglo($1, $3, @1.first_line, @1.first_column);
	}
	/* | expresionPostfix CORIZQ CORDER {
		$$ = $1 + $2 + $3;
	} */
	| expresionPostfix PARIZQ PARDER {
		$$ = new LlamadaFuncion($1, [], this._$.first_line, this._$.first_column);
	}
	| expresionPostfix PARIZQ expresionListaArgumentos PARDER {
		$$ = new LlamadaFuncion($1, $3, this._$.first_line, this._$.first_column);
	}
	| expresionPostfix PUNTO IDENTIFICADOR PARIZQ expresionListaArgumentos PARDER {
    		$$ = new LlamadaFuncion($1, $3, this._$.first_line, this._$.first_column);
    	}
	| expresionPostfix PUNTO IDENTIFICADOR {
		$$ = new AccesoPropiedadEstructura($1, new Identificador($3, @3.first_line, @3.first_column), this._$.first_line, this._$.first_column);
	}
	| expresionPostfix OPINCREMENTO {
		$$ = new ExpresionPostIncremento($1, this._$.first_line, this._$.first_column);
	}
	| expresionPostfix OPDECREMENTO {
		$$ = new ExpresionPostDecremento($1, this._$.first_line, this._$.first_column);
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
	}
	| CADENA {
		$$ = new Cadena(new Tipo(Types.STRING, false, null), $1, new Arreglo(new Tipo(Types.STRING, true, null), this._$.first_line, this._$.first_column), this._$.first_line, this._$.first_column);
	}
	| CARACTER {
		$$ = new Valor(new Tipo(Types.CHAR, false, null), $1, this._$.first_line, this._$.first_column);
	}
	| ENTERO {
		$$ = new Valor(new Tipo(Types.INTEGER, false, null), $1, this._$.first_line, this._$.first_column);
	}
	| DECIMAL {
		$$ = new Valor(new Tipo(Types.DOUBLE, false, null), $1, this._$.first_line, this._$.first_column);
	}
	| TRUE {
		$$ = new Valor(new Tipo(Types.BOOLEAN, false, null), 1, this._$.first_line, this._$.first_column);
	}
	| FALSE {
		$$ = new Valor(new Tipo(Types.BOOLEAN, false, null), 0, this._$.first_line, this._$.first_column);
	}
	| DOLAR IDENTIFICADOR {
		$$ = new ParametroPorValor(new Tipo("", false, null), $2, this._$.first_line, this._$.first_column);
	}
	| STRC IDENTIFICADOR PARIZQ PARDER { //strc Estudiante() (crea instancias de estructuras)
		$$ = new InstanciaEstructura($2, this._$.first_line, this._$.first_column);
	}
	| STRC IDENTIFICADOR CORIZQ expresion CORDER  { //strc Estudiante[2] (crea ARREGLOS de estructuras)
		$$ = new Arreglo(new Tipo("", true, $2), $4, @2.first_line, @2.first_column);
	}
	| STRC tipo CORIZQ expresion CORDER { //strc integer (inicializador de ARREGLOS de primitivos)
		$$ = new Arreglo(new Tipo($2, true, null), $4, @2.first_line, @2.first_column);
	}
	| NULL  {
		$$ = new Valor(new Tipo(Types.NULL, false, null), 'null', this._$.first_line, this._$.first_column);
	}
	| LLAVIZQ expresionListaArgumentos LLAVDER {
		$$ = new ArregloExplicito($2, @2.first_line, @2.first_column);
	}
	| PARIZQ expresion PARDER {
		$$ = $2
	}
;