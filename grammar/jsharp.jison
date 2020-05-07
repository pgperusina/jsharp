/**
 * JSharp parser
 */

/* Lexical definition */
%lex

%options case-insensitive

%%

/* White spaces */
[ \r\t]+            {}
\n                  {}

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
\w+							return 'TIPO_NOMBRE';


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
		$$ = $1;
		console.log("IMPORTS |||| " + $$);
	}
	| declaraciones PCOMA {
		$$ = $1;
		console.log("DECLARACION |||| " + $$);
	}
	| asignaciones PCOMA {
		$$ = $1;
		console.log("ASIGNACION  |||| " + $$);
	}
	| definicionEstructura PCOMA {
		$$ = $1;
		console.log("DEFINICION ESTRUCTURA |||| " + $$);
	}
	| definicionFuncion {
		$$ = $1;
		console.log("FUNCION |||| " + $$);
	}
	| if {
		$$ = $1;
		console.log("IF |||| " + $$);
	}
	| switch {
		$$ = $1;
		console.log("SWITCH |||| " + $$);
	}
	| while {
		$$ = $1;
		console.log("WHILE |||| " + $$);
	}
	| doWhile {
		$$ = $1;
		console.log("DOWHILE |||| " + $$);
	}
	| for {
		$$ = $1;
		console.log("FOR |||| " + $$);
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
		console.log($$);
	}
	| trycatch {
		$$ = $1;
	}
	| throw PCOMA {
		$$ = $1;
	}
	| expresion PCOMA{
		$$ = $1;
		console.log("EXPRESION |||| " + $$);
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
		$$ = $1 + $2 + $3 + $4;
	}
	| definicionTipo listaIds {  // declaracion tipo 5
		$$ = $1 + $2;
	}
	| calificadorTipo IDENTIFICADOR DPIGUAL expresion {  // declaracion tipo 2, 3 y 4 - incluye estructuras
		$$ = $1 + $2 + $3 + $4;
	}
	| IDENTIFICADOR listaIds IGUAL expresion {  // declaracion estructuras
		$$ = $1 + $2 + $3 + $4 ;
	} 
	| IDENTIFICADOR CORIZQ CORDER IDENTIFICADOR IGUAL expresion {  // declaracion arreglos de estructuras
		$$ = $1 + $2 + $3 + $4 + $5 + $6 ;
	}
;

definicionTipo
	: tipo CORIZQ CORDER {
		$$ = $1 + $2 + $3;
	}
	| tipo {
		$$ = $1;
	}
;

tipo
	: INTEGER {
		$$ = $1;
	}
	| DOUBLE {
		$$ = $1;
	}
	| CHAR {
		$$ = $1;
	}
	| BOOLEAN {
		$$ = $1;
	}
	| VOID {
		$$ = $1;
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
		$$ = $1;
	}
	| CONST {
		$$ = $1;
	}
	| GLOBAL {
		$$ = $1;
	}
;

asignaciones
	: IDENTIFICADOR CORIZQ expresion CORDER IGUAL expresion {
		$$ = $1 + $2 + $3 + $4 + $5 + $6;
		console.log("ASIGNACION POSICION ARREGLO -- " + $$);
	}
;

definicionEstructura
	: DEFINE IDENTIFICADOR AS CORIZQ listaParametros CORDER {
		$$ = $1 + $2 + $3 + $4 + $5 + $6;
	}
;
//FUNCIONES
definicionFuncion
	: definicionTipo IDENTIFICADOR PARIZQ listaParametros PARDER bloqueInstrucciones {
		$$ = $1 + " " + $2 + "(" + $listaParametros + ")" + $bloqueInstrucciones;
		// todo - crear nodo FUNCION
	}
	| definicionTipo IDENTIFICADOR PARIZQ  PARDER bloqueInstrucciones {
		$$ = $1 + " " + $2 + "( )" + $5;
		// todo - crear nodo FUNCION
	}
	| IDENTIFICADOR IDENTIFICADOR PARIZQ listaParametros PARDER bloqueInstrucciones {
		$$ = $1 + " " + $2 + "(" + $listaParametros + ")" + $bloqueInstrucciones;
		// todo - crear nodo FUNCION
	}
	| IDENTIFICADOR IDENTIFICADOR PARIZQ  PARDER bloqueInstrucciones {
		$$ = $1 + " " + $2 + "( )" + $bloqueInstrucciones;
		// todo - crear nodo FUNCION
	}
	| IDENTIFICADOR CORIZQ CORDER IDENTIFICADOR PARIZQ listaParametros PARDER bloqueInstrucciones {
		$$ = $1 + $2 + $3 + $4 + $5 + $6 + $7 + $8;
		// todo - crear nodo FUNCION
	}
	| IDENTIFICADOR CORIZQ CORDER IDENTIFICADOR PARIZQ PARDER bloqueInstrucciones {
		$$ = $1 + $2 + $3 + $4 + $5 + $6 + $7;
		// todo - crear nodo FUNCION
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
		$$ = $1 + " " + $2;
	}
	| IDENTIFICADOR IDENTIFICADOR {
		$$ = $1 + " " + $2;
	}
	| IDENTIFICADOR CORIZQ CORDER IDENTIFICADOR {
		$$ = $1 + $2 + $3 + " " + $4;
	}
;

//CONTROL DE FLUJO

if
	: IF PARIZQ expresion PARDER bloqueInstrucciones { 
        $$ = $1 + $2 + $3 + $4 + $5;
			// todo -- crear nodo de if
		}
	| IF PARIZQ expresion PARDER bloqueInstrucciones ELSE  if { 
		$$ = $1 + $2 + $3 + $4 + $5 + $6 + $7;
			// todo -- crear nodo de if
		}
	| IF PARIZQ expresion PARDER bloqueInstrucciones ELSE bloqueInstrucciones { 
		$$ = $1 + $2 + $3 + $4 + $5 + $6 + $7;
			// todo -- crear nodo de if
		}
;

bloqueInstrucciones
	: LLAVIZQ instrucciones LLAVDER {
		// todo -- crear lista de instrucciones
		$$ = $2;
	}
;

switch
	: SWITCH PARIZQ expresion PARDER LLAVIZQ cases LLAVDER {
		$$ = $1 + $2 + $3 +$4 + $5 + $6 + $7;
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
		$$ = $1 + $2 + $3 +$4;
		// todo - crear nodo case
	}
	| DEFAULT DOSPUNTOS instrucciones {
		$$ = $1 + $2 + $3
		// todo - crear nodo case default
	}
;

while
	: WHILE PARIZQ expresion PARDER bloqueInstrucciones {
		$$ = $1 + $2 + $3 +$4 + $5;
	}
;

doWhile
	: DO bloqueInstrucciones WHILE PARIZQ expresion PARDER {
		$$ = $1 + $2 + $3 +$4 + $5 + $6;
		// todo - crear nodo dowhile
	}
;

for
	: FOR PARIZQ inicio  condicion  final PARDER bloqueInstrucciones {
		$$ = $1 + $2 + $3 +$4 + $5 + $6 + $7;
		// todo - crear nodo for
	}
;

inicio
	: declaraciones PCOMA { 
		$$ = $1 + $2;
	}
	| PCOMA { $$ = ""; }
;

condicion
	: expresionOrExclusivo PCOMA { 
		$$ = $1 + $2;
	}
	| PCOMA { $$ = ""; }
;

final
	: expresion { 
		$$ = $1;
	}
	| { $$ = "";}
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
		$$ = $1;
	}
	| expresionListaArgumentos COMA expresionAsignacion {
		$$ = $1+ $2 + $3;
	}
;

expresionPrimaria
	: IDENTIFICADOR {
		$$ = $1;
	}
	| CADENA {
		$$ = $1;
	}
	| CARACTER {
		$$ = $1;
	}
	| ENTERO {
		$$ = Number($1);
	}
	| DECIMAL {
		$$ = Number($1);
	}
	| TRUE {
		$$ = $1
	}
	| FALSE {
		$$ = $1
	}
	| DOLAR IDENTIFICADOR {
		$$ = $1 + $2;
	}
	| STRC IDENTIFICADOR {
		$$ = $1 + $2;
	}
	| STRC tipo {
		$$ = $1 + $2;
	}
	| NULL  {
		$$ = $1;
	}
	| LLAVIZQ expresionListaArgumentos LLAVDER {
		$$ = $1 + $2 + $3;
	}
	| PARIZQ expresion PARDER {
		$$ = $1 + $2 + $3;
	}
;

/* expresion
	: expresion OPINCREMENTO    	{ $$ = $1 + 1; }
	| expresion OPDECREMENTO    	{ $$ = $1 - 1; }
	| expresion MAS expresion       { $$ = $1 + $3; }
	| expresion MENOS expresion     { $$ = $1 - $3; }
	| expresion POR expresion       { $$ = $1 * $3; }
	| expresion DIVIDIDO expresion  { $$ = $1 / $3; }
	| expresion MODULO expresion  	{ $$ = $1 % $3; }
	| expresion POWER expresion		{ $$ = $1 * $1;}
	| expresion XOR expresion		{ $$ = $1 ^ $3; }
	| expresion OR expresion		{ $$ = $1 || $3; }
	| expresion AND expresion		{ $$ = $1 && $3; }
	| expresion MENORIGUAL expresion	{ $$ = $1 <= $3; }
	| expresion MAYORIGUAL expresion	{ $$ = $1 >= $3; }
	| expresion MENOR expresion		{ $$ = $1 < $3; }
	| expresion MAYOR expresion		{ $$ = $1 > $3; }
	| expresion IGUALA expresion	{ $$ = $1 == $3; }
	| expresion TRIPLEIGUAL expresion	{ $$ = $1 === $3; }
	| expresion DIFERENTEDE expresion	{ $$ = $1 != $3; }
	| MENOS expresion %prec UMENOS   { $$ = $2 *-1; }
	| NOT expresion 				 { $$ = !$2; }
	
	| llamada {
		$$ = $1;
	}
	
	| ENTERO                        { $$ = Number($1); }
	| DECIMAL                       { $$ = Number($1); }
	| TRUE                      	{ $$ = Boolean($1); }
	| FALSE                       	{ $$ = Boolean($1); }
	| IDENTIFICADOR					{ $$ = $1; }
	| CADENA {
		$$ = $1;
	}
	| CARACTER {
		$$ = $1;
	}
	| LLAVIZQ listaArgumentos LLAVDER { 
		$$ = $2;
		console.log("lista expresiones inicializacion arreglos -- " + $$); 
	}
	| accesoArreglo {
		$$ = $1;
		console.log("Acceso a arreglo en EXP -- " + $$);
	}
	| PARIZQ expresion PARDER       { $$ = $2; }
	
; */