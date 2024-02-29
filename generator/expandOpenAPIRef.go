package main

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/pb33f/libopenapi/index"
	"gopkg.in/yaml.v3"
)

func main() {

	// if len(os.Args) != 1 {
	// 	fmt.Printf("No input file provided!\n")
	// }

	// load an OpenAPI 3 specification from bytes
	// petstore, _ := ioutil.ReadFile(os.Args[0])
	petstore, _ := ioutil.ReadFile("openapi/openapi.yml")

	// create a root node to unmarshal the spec into.
	var rootNode yaml.Node
	_ = yaml.Unmarshal(petstore, &rootNode)

	// create a new config that does not allow lookups.
	indexConfig := index.CreateClosedAPIIndexConfig()

	// create a new rolodex
	rolodex := index.NewRolodex(indexConfig)

	// set the rolodex root node to the root node of the spec.
	rolodex.SetRootNode(&rootNode)

	// index the rolodex
	indexedErr := rolodex.IndexTheRolodex()
	if indexedErr != nil {
		panic(indexedErr)
	}

	// resolve the petstore
	rolodex.Resolve()

	// extract the resolver from the root index.
	node := rolodex.GetRootNode()

	b, e := yaml.Marshal(node)
	if e != nil {
		panic(e)
	}

	var newNode yaml.Node
	_ = yaml.Unmarshal(b, &newNode)

	err := os.WriteFile("openapi/expanded.yml", b, 0644)
	if err != nil {
		fmt.Printf("Failed to write file: %v", err)
		return
	}

}
