
$(document).ready()
{
  var myGraph = new FluidGraph();

  myGraph.config.bgElementType = "simple";
  myGraph.config.editGraphMode = false;
  myGraph.appli = "fluidgraphclient/";
  myGraph.config.version = "loglink46";
  myGraph.svgContainer.width = 280;
  myGraph.svgContainer.height = 280;
  var $activTab = "local";

  if ($activTab == "local")
  {
    $("#menuTabs .item").tab('change tab', 'local');
  }

  $('#menuTabs .item').tab({history:false});

  // $divTest = $("#test");
  // myGraph.loadLocalGraph("place to b");
  // myGraph.initSvgContainer("#test");
  // myGraph.drawGraph();
  // myGraph.movexy();

  /*******************************/
  /* Load local graph into cards */
  /*******************************/

  myGraph.getListOfGraphsInLocalStorage();

  $divLocalCards = $("#divLocalCards");
  myGraph.listOfLocalGraphs.forEach(function(value, index) {
    var $graphName = value[0];
    var $graphId = index;
    myGraph.loadLocalGraph($graphName);
    myGraph.graphInCard($divLocalCards, $graphId, $graphName, 'local');
  });

  /**********************************/
  /* Load external graph into cards */
  /**********************************/

  $("#message").html("<p>Les vignettes des cartos PAIR peuvent mettre du temps à apparaitre.<br>"
  + "Si les vignettes ne s'affichent pas, plusieurs raisons possibles :"
  + "<ul><li>Soit le serveur de base de données n'est pas démarré : "
  + "dans ce cas envoyez un email à <a href='mailto:contact@assemblee-virtuelle.org'>contact@assemblee-virtuelle.org</a></li>"
  + "<li>Acceptez l'exception de sécurité : "
  +" <a href='https://ldp.virtual-assembly.org:8443/'>En cliquant sur ce lien</a> jusqu'à obtenir un logo 'stample',"
  +" puis retourner <a href='"+myGraph.domaine+"skippair'>sur SKIPPAIR</a></li></p>").show();

  var store = new MyStore({ container : myGraph.externalStore.uri,
                            context : myGraph.externalStore.context,
                            template : "",
                            partials : ""})

  var storeList = new MyStore({ container : myGraph.externalStore.uri,
                            context : "http://owl.openinitiative.com/oicontext.jsonld",
                            template : "",
                            partials : ""})

  storeList.list(myGraph.externalStore.uri).then(function(list){
    list.forEach(function(item){
      $("#message").hide();
      var $externalGraphId;
      var $externalGraphName;
      storeList.get(item["@id"]).then(function(graphElementJsonld){
        $externalGraphId = graphElementJsonld["@id"].split("/").pop();
        $externalGraphName = graphElementJsonld["foaf:name"];

        if ($externalGraphId)
        {
          var $divExternalCards = $("#divExternalCards");
          store.get(myGraph.externalStore.uri+$externalGraphId).then(function(externalGraph){
            myGraph.d3Data = myGraph.jsonLdToD3Data(externalGraph);
            myGraph.graphInCard($divExternalCards, $externalGraphId, $externalGraphName, 'external');
          });
        }
      })
    })
  });

}
